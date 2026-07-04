import { handleApiOperation } from '../api-error-handler.js';

function apiError(status: number, statusText: string, body: any = {}) {
  return { status, statusText, body };
}

describe('handleApiOperation', () => {
  let stderrSpy: jest.SpyInstance;

  beforeEach(() => {
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stderrSpy.mockRestore();
  });

  it('returns success with the resolved data', async () => {
    const operation = jest.fn().mockResolvedValue({ id: 1 });
    const result = await handleApiOperation(operation, 'Error doing thing');
    expect(result).toEqual({ success: true, data: { id: 1 } });
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('returns the plain error message for a non-API-shaped error, without retrying', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('boom'));
    const result = await handleApiOperation(operation, 'Error doing thing');
    expect(result).toEqual({ success: false, error: 'boom', details: undefined });
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('formats API client errors with the prefix and exposes the body as details', async () => {
    const operation = jest.fn().mockRejectedValue(apiError(404, 'Not Found', { message: 'missing' }));
    const result = await handleApiOperation(operation, 'Error fetching issue');
    expect(result).toEqual({
      success: false,
      error: 'Error fetching issue: 404 Not Found',
      details: { message: 'missing' },
    });
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('does not retry 4xx client errors (not transient)', async () => {
    const operation = jest.fn().mockRejectedValue(apiError(400, 'Bad Request'));
    const result = await handleApiOperation(operation, 'Error', { maxRetries: 3, baseDelayMs: 1, maxDelayMs: 1 });
    expect(result.success).toBe(false);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries a 429 and succeeds once the operation recovers', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(apiError(429, 'Too Many Requests'))
      .mockRejectedValueOnce(apiError(429, 'Too Many Requests'))
      .mockResolvedValueOnce('ok');

    const result = await handleApiOperation(operation, 'Error', { maxRetries: 3, baseDelayMs: 1, maxDelayMs: 1 });

    expect(result).toEqual({ success: true, data: 'ok' });
    expect(operation).toHaveBeenCalledTimes(3);
    expect(stderrSpy).toHaveBeenCalledTimes(2);
    const firstLogEntry = JSON.parse(stderrSpy.mock.calls[0][0] as string);
    expect(firstLogEntry.message).toMatch(/retrying after 429/);
    expect(firstLogEntry).toMatchObject({ level: 'warn', status: 429, attempt: 1, maxRetries: 3 });
  });

  it('retries 5xx server errors the same way as 429', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(apiError(503, 'Service Unavailable'))
      .mockResolvedValueOnce('ok');

    const result = await handleApiOperation(operation, 'Error', { maxRetries: 3, baseDelayMs: 1, maxDelayMs: 1 });

    expect(result).toEqual({ success: true, data: 'ok' });
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('gives up after maxRetries and returns the final formatted error', async () => {
    const operation = jest.fn().mockRejectedValue(apiError(503, 'Service Unavailable', { retry: false }));

    const result = await handleApiOperation(operation, 'Error', { maxRetries: 2, baseDelayMs: 1, maxDelayMs: 1 });

    expect(result).toEqual({
      success: false,
      error: 'Error: 503 Service Unavailable',
      details: { retry: false },
    });
    // 1 initial attempt + 2 retries
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('does not retry at all when maxRetries is 0, even for a retryable status', async () => {
    const operation = jest.fn().mockRejectedValue(apiError(429, 'Too Many Requests'));
    const result = await handleApiOperation(operation, 'Error', { maxRetries: 0 });
    expect(result.success).toBe(false);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('applies default retry tuning (3 retries) when retryOptions is omitted', async () => {
    jest.useFakeTimers();
    try {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(apiError(429, 'Too Many Requests'))
        .mockRejectedValueOnce(apiError(429, 'Too Many Requests'))
        .mockRejectedValueOnce(apiError(429, 'Too Many Requests'))
        .mockResolvedValueOnce('ok');

      const resultPromise = handleApiOperation(operation, 'Error');
      // Default maxDelayMs is 5000; advance past it once per expected retry.
      await jest.advanceTimersByTimeAsync(5000);
      await jest.advanceTimersByTimeAsync(5000);
      await jest.advanceTimersByTimeAsync(5000);

      const result = await resultPromise;
      expect(result).toEqual({ success: true, data: 'ok' });
      expect(operation).toHaveBeenCalledTimes(4);
    } finally {
      jest.useRealTimers();
    }
  });
});
