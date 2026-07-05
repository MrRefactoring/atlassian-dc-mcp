import type { ZodType } from 'zod';

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';

/**
 * A single HTTP request an api/ function asks the client to perform.
 *
 * `url` is a path relative to the client's `baseUrl` (e.g. `/api/latest/projects`),
 * with any path parameters already interpolated via {@link enc}. Query parameters go
 * in `searchParams` (undefined/null entries are dropped). A JSON body goes in `body`;
 * multipart uploads go in `formData`. When `schema` is present and parsing is enabled,
 * the response is validated/typed through it.
 */
export interface SendRequestOptions<T = unknown> {
  method: HttpMethod;
  url: string;
  searchParams?: Record<string, unknown>;
  body?: unknown;
  formData?: Record<string, unknown>;
  mediaType?: string;
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
 * Encode a value interpolated into a request URL path.
 *
 * Uses `encodeURI` (not `encodeURIComponent`) so `/` is preserved — file-path
 * parameters like `browse/{path}` must keep their separators, matching the
 * previous generated client's single-encoder behaviour.
 */
export const enc = (value: string | number): string => encodeURI(String(value));
