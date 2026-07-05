import { ApiError } from './apiError.js';
import { logger } from '../logger.js';
import type { HttpClientConfig, CredentialSource, HttpClient, SendRequestOptions } from './interface/index.js';

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const REQUEST_TIMEOUT_MS_ENV_VAR = 'ATLASSIAN_DC_MCP_REQUEST_TIMEOUT_MS';

const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> =>
  value !== undefined && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const isStringWithValue = (value: unknown): value is string => isString(value) && value !== '';

const isBlob = (value: unknown): value is Blob =>
  typeof Blob !== 'undefined' && value instanceof Blob;

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== 'undefined' && value instanceof FormData;

const base64 = (str: string): string => {
  try {
    return btoa(str);
  } catch {
    return Buffer.from(str).toString('base64');
  }
};

/**
 * Serialize query params. Arrays repeat the key; nested objects become `key[k]`;
 * undefined/null are dropped. Returns a string beginning with `?`, or empty.
 */
const getQueryString = (params: Record<string, unknown>): string => {
  const parts: string[] = [];

  const append = (key: string, value: unknown): void => {
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  const process = (key: string, value: unknown): void => {
    if (!isDefined(value)) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => process(key, v));
    } else if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => process(`${key}[${k}]`, v));
    } else {
      append(key, value);
    }
  };

  Object.entries(params).forEach(([key, value]) => process(key, value));

  return parts.length > 0 ? `?${parts.join('&')}` : '';
};

const resolveCredential = (source: CredentialSource): string | undefined => {
  const value = typeof source === 'function' ? source() : source;

  return value ?? undefined;
};

const buildHeaders = (config: HttpClientConfig, options: SendRequestOptions): Headers => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...config.headers,
    ...options.headers,
  };

  const token = resolveCredential(config.token);
  const username = resolveCredential(config.username);
  const password = resolveCredential(config.password);

  if (isStringWithValue(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (isStringWithValue(username) && isStringWithValue(password)) {
    headers['Authorization'] = `Basic ${base64(`${username}:${password}`)}`;
  }

  // Content-Type is derived from an explicit `body` only. A multipart upload lives in
  // `options.formData` (body stays undefined), so no Content-Type is set here and fetch
  // supplies the correct `multipart/form-data; boundary=...` itself.
  if (options.body !== undefined) {
    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    } else if (isBlob(options.body)) {
      headers['Content-Type'] = 'application/octet-stream';
    } else if (isString(options.body)) {
      headers['Content-Type'] = 'text/plain';
    } else if (!isFormData(options.body)) {
      headers['Content-Type'] = 'application/json';
    }
  }

  return new Headers(headers);
};

const getRequestBody = (options: SendRequestOptions): BodyInit | undefined => {
  if (options.body === undefined) {
    return undefined;
  }

  if (options.contentType?.includes('/json')) {
    return JSON.stringify(options.body);
  }

  if (isString(options.body) || isBlob(options.body) || isFormData(options.body)) {
    return options.body as BodyInit;
  }

  return JSON.stringify(options.body);
};

const buildFormData = (fields: Record<string, unknown>): FormData => {
  const formData = new FormData();

  const process = (key: string, value: unknown): void => {
    if (isString(value) || isBlob(value)) {
      formData.append(key, value as string | Blob);
    } else {
      formData.append(key, JSON.stringify(value));
    }
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (!isDefined(value)) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => process(key, v));
    } else {
      process(key, value);
    }
  });

  return formData;
};

const getRequestTimeoutMs = (): number => {
  const raw = process.env[REQUEST_TIMEOUT_MS_ENV_VAR];

  if (!raw) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }

  const parsed = Number.parseInt(raw.trim(), 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_REQUEST_TIMEOUT_MS;
};

const doFetch = async (url: string, init: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getRequestTimeoutMs());

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const getResponseBody = async (
  response: Response,
  responseType?: SendRequestOptions['responseType'],
): Promise<unknown> => {
  if (response.status === 204) {
    return undefined;
  }

  if (responseType === 'arraybuffer') {
    return new Uint8Array(await response.arrayBuffer());
  }

  const contentType = response.headers.get('Content-Type');

  if (contentType) {
    const isJSON = ['application/json', 'application/problem+json'].some((type) =>
      contentType.toLowerCase().startsWith(type),
    );

    return isJSON ? await response.json() : await response.text();
  }

  return undefined;
};

/**
 * Create an {@link HttpClient} bound to an Atlassian Data Center instance.
 *
 * Shared by every product's api client (Bitbucket, Jira, …). Performs a single fetch
 * per request (no built-in retry — 429/5xx retries are owned by `handleApiOperation`),
 * honours `ATLASSIAN_DC_MCP_REQUEST_TIMEOUT_MS`, throws {@link ApiError} on non-2xx, and
 * validates successful JSON responses with the request's Zod `schema` unless `skipParsing`
 * is set or the request asks for a raw `arraybuffer` (binary content).
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  const baseUrl = config.baseUrl.replace(/\/$/, '');
  const skipParsing = config.skipParsing ?? false;
  const softValidation = config.softValidation ?? false;

  return {
    async sendRequest<T>(options: SendRequestOptions<T>): Promise<T> {
      const url = `${baseUrl}${options.url}${getQueryString(options.searchParams ?? {})}`;
      const formData = options.formData ? buildFormData(options.formData) : undefined;
      const body = getRequestBody(options);
      const headers = buildHeaders(config, options);

      const response = await doFetch(url, {
        method: options.method,
        headers,
        body: body ?? formData,
      });

      const responseBody = await getResponseBody(response, options.responseType);

      if (!response.ok) {
        throw new ApiError({
          url,
          status: response.status,
          statusText: response.statusText,
          body: responseBody,
          message: `API request failed: ${response.status} ${response.statusText}`,
        });
      }

      // Only validate a non-empty JSON body — some endpoints return an empty 200
      // (e.g. unconfigured settings), which is a legitimate `undefined` result; raw
      // `arraybuffer` responses are returned as-is.
      if (options.schema && !skipParsing && options.responseType !== 'arraybuffer' && responseBody !== undefined) {
        if (softValidation) {
          const result = options.schema.safeParse(responseBody);

          if (result.success) {
            return result.data;
          }

          // Schema drift: never reject a real response — pass the raw body through and
          // surface the mismatch so the schema can be corrected.
          logger.warn('Response failed schema validation; passing through unvalidated', {
            url,
            issues: result.error.issues.slice(0, 3).map((issue) => ({
              path: issue.path.join('.') || '<root>',
              code: issue.code,
            })),
          });

          return responseBody as T;
        }

        return options.schema.parse(responseBody);
      }

      return responseBody as T;
    },
  };
}
