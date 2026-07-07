/**
 * Error thrown by {@link HttpClient.sendRequest} on a non-2xx response.
 *
 * The `{ status, statusText, body }` shape is a contract with `handleApiOperation`
 * in `datacenter-mcp-core` (see its `isApiClientError`): it drives retry decisions
 * for 429/5xx and shapes the error surfaced to callers. Keep these three fields.
 */
export class ApiError extends Error {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;
  /** Parsed `Retry-After` response header in milliseconds, when the server sent one (e.g. on 429/503). */
  readonly retryAfterMs?: number;

  constructor(args: { url: string; status: number; statusText: string; body: unknown; message: string; retryAfterMs?: number }) {
    super(args.message);
    this.name = 'ApiError';
    this.url = args.url;
    this.status = args.status;
    this.statusText = args.statusText;
    this.body = args.body;
    this.retryAfterMs = args.retryAfterMs;
  }
}
