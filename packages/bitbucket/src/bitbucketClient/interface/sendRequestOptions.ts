import type { ZodType } from 'zod';
import type { HttpMethod } from './httpMethod.js';

/**
 * A single HTTP request an api/ function asks the client to perform.
 *
 * `url` is a path relative to the client's `baseUrl` (e.g. `/api/latest/projects`),
 * with any path parameters already interpolated via the `route` builder. Query
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
