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

  constructor(args: { url: string; status: number; statusText: string; body: unknown; message: string }) {
    super(args.message);
    this.name = 'ApiError';
    this.url = args.url;
    this.status = args.status;
    this.statusText = args.statusText;
    this.body = args.body;
  }
}
