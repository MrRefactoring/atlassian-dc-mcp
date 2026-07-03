/**
 * Utility for handling API errors consistently across services
 */
export interface ApiErrorResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface RetryOptions {
  /** Number of retry attempts after the initial call (default: 3). Set to 0 to disable retries. */
  maxRetries?: number;
  /** Base delay in milliseconds for the first retry; doubles each subsequent attempt (default: 300). */
  baseDelayMs?: number;
  /** Upper bound for the (pre-jitter) computed delay, in milliseconds (default: 5000). */
  maxDelayMs?: number;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 300;
const DEFAULT_MAX_DELAY_MS = 5000;

/**
 * The generated OpenAPI clients throw this shape on a non-2xx response
 * (see `<product>-client/core/request.ts`'s `catchErrorCodes`).
 */
type ApiClientError = { status: number; body: any; statusText: string };

function isApiClientError(e: unknown): e is ApiClientError {
  return !!e && typeof e === 'object' && 'status' in e && 'body' in e;
}

/**
 * 429 (rate limited) and 5xx (server-side) failures are transient by nature and
 * safe to retry — the server rejected the request outright rather than partially
 * processing it. 4xx client errors (bad input, auth, not found, ...) will not
 * succeed on retry, so they are returned to the caller immediately.
 */
function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

function computeDelayMs(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exponential = baseDelayMs * 2 ** attempt;
  const capped = Math.min(exponential, maxDelayMs);
  // Full jitter (see AWS's "Exponential Backoff And Jitter" post): a random delay in
  // [0, capped] spreads out retries from concurrent callers instead of retrying in lockstep.
  return Math.random() * capped;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function describeError(e: unknown, errorPrefix: string): { error: string; details: any } {
  if (isApiClientError(e)) {
    return {
      error: `${errorPrefix}: ${e.status} ${e.statusText}`,
      details: e.body,
    };
  }
  return {
    error: e instanceof Error ? e.message : String(e),
    details: undefined,
  };
}

/**
 * Handle API errors in a consistent way across services, retrying transient
 * 429/5xx failures with exponential backoff and jitter before giving up.
 * @param operation Function that performs the API operation
 * @param errorPrefix Prefix for the error message
 * @param retryOptions Optional retry tuning; sensible defaults apply when omitted
 * @returns Standardized response with success status, data, and error details
 */
export async function handleApiOperation<T>(
  operation: () => Promise<T>,
  errorPrefix: string,
  retryOptions: RetryOptions = {}
): Promise<ApiErrorResponse<T>> {
  const maxRetries = retryOptions.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelayMs = retryOptions.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const maxDelayMs = retryOptions.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;

  for (let attempt = 0; ; attempt++) {
    try {
      const data = await operation();
      return {
        success: true,
        data
      };
    } catch (e) {
      const status = isApiClientError(e) ? e.status : undefined;
      const canRetry = status !== undefined && isRetryableStatus(status) && attempt < maxRetries;
      if (canRetry) {
        const delayMs = computeDelayMs(attempt, baseDelayMs, maxDelayMs);
        console.error(
          `${errorPrefix}: retrying after ${status} (attempt ${attempt + 1}/${maxRetries}, waiting ${Math.round(delayMs)}ms)`
        );
        await sleep(delayMs);
        continue;
      }

      const { error, details } = describeError(e, errorPrefix);
      return {
        success: false,
        error,
        details
      };
    }
  }
}
