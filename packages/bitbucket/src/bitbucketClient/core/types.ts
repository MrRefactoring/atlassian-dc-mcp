import type { ZodType } from 'zod';

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';

/**
 * A single HTTP request an api/ function asks the client to perform.
 *
 * `url` is a path relative to the client's `baseUrl` (e.g. `/api/latest/projects`),
 * with any path parameters already interpolated via the {@link route} builder. Query
 * parameters go in `searchParams` (undefined/null entries are dropped). A JSON body goes
 * in `body`; multipart uploads go in `formData`. When `schema` is present and parsing is
 * enabled, the response is validated/typed through it.
 */
export interface SendRequestOptions<T = unknown> {
  url: string;
  method: HttpMethod;
  searchParams?: Record<string, unknown>;
  body?: unknown;
  formData?: Record<string, unknown>;
  contentType?: string;
  headers?: Record<string, string>;
  schema?: ZodType<T>;
}

/** A credential: a literal string, or a thunk read lazily on each request, or absent. */
export type CredentialSource = string | (() => string | undefined) | undefined;

export interface BitbucketClientConfig {
  /** Fully resolved API base URL, e.g. `http://host:7990/rest`. */
  baseUrl: string;
  /** Personal access token → `Authorization: Bearer`. */
  token?: CredentialSource;
  /** Basic-auth username (used with `password`) → `Authorization: Basic`; overrides `token`. */
  username?: CredentialSource;
  password?: CredentialSource;
  /** Extra headers merged into every request. */
  headers?: Record<string, string>;
  /** Skip Zod parsing of responses — escape hatch against schema drift. */
  skipParsing?: boolean;
}

export interface HttpClient {
  sendRequest<T>(options: SendRequestOptions<T>): Promise<T>;
}

/**
 * Tagged-template URL path builder.
 *
 * Interpolated values are encoded with `encodeURI` (not `encodeURIComponent`) so `/` is
 * preserved — file-path parameters like `browse/{path}` must keep their separators. Call
 * sites write ``route`/api/latest/projects/${projectKey}/repos/${slug}` `` instead of
 * wrapping every segment by hand.
 */
export const route = (strings: TemplateStringsArray, ...values: (string | number)[]): string =>
  strings.reduce((out, str, i) => out + str + (i < values.length ? encodeURI(String(values[i])) : ''), '');

/**
 * Build a request body from a flat parameters object.
 *
 * Endpoint parameters are flat: path, query and body fields sit side by side. This
 * selects just the body subset — either an explicit list of keys, or the keys of a
 * Zod object's `.shape` (typically a body model schema, optionally `.omit()`-ed of
 * keys that collide with a path/query param) — keeping only defined values.
 */
export const pickBody = <T extends object>(
  source: T,
  keys: readonly string[] | { readonly shape: Record<string, unknown> },
): Record<string, unknown> => {
  const list = 'shape' in keys ? Object.keys(keys.shape) : keys;
  const record = source as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const key of list) {
    if (record[key] !== undefined) {
      out[key] = record[key];
    }
  }

  return out;
};
