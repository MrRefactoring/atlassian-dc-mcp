import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createHttpClient, ApiError, parseRetryAfterMs } from '../src/httpClient/index.js';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

/** Replace global.fetch with a mock resolving to `response`, and return the mock. */
function mockFetch(response: Response) {
  const fn = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => response);
  global.fetch = fn as unknown as typeof fetch;

  return fn;
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('createHttpClient', () => {
  const base = { baseUrl: 'https://x.example/rest' };

  it('sends Bearer auth and validates a JSON response through the schema', async () => {
    const fetchMock = mockFetch(jsonResponse({ id: 7 }));
    const client = createHttpClient({ ...base, token: 'tok' });

    const result = await client.sendRequest({ url: '/api/2/x', method: 'GET', schema: z.object({ id: z.number() }) });

    expect(result).toEqual({ id: 7 });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://x.example/rest/api/2/x');
    expect((init!.headers as Headers).get('Authorization')).toBe('Bearer tok');
  });

  it('Basic auth overrides Bearer when username+password are both set', async () => {
    const fetchMock = mockFetch(jsonResponse({}));
    const client = createHttpClient({ ...base, token: 'tok', username: 'u', password: 'p' });

    await client.sendRequest({ url: '/x', method: 'GET' });

    const [, init] = fetchMock.mock.calls[0]!;
    expect((init!.headers as Headers).get('Authorization')).toBe(`Basic ${btoa('u:p')}`);
  });

  it('returns undefined for a 204 response', async () => {
    mockFetch(new Response(null, { status: 204 }));
    const client = createHttpClient(base);

    expect(await client.sendRequest({ url: '/x', method: 'DELETE' })).toBeUndefined();
  });

  it('returns raw text for a non-JSON content type', async () => {
    mockFetch(new Response('hello', { status: 200, headers: { 'Content-Type': 'text/plain' } }));
    const client = createHttpClient(base);

    expect(await client.sendRequest({ url: '/x', method: 'GET' })).toBe('hello');
  });

  it('throws ApiError carrying status and body on a non-2xx response', async () => {
    mockFetch(jsonResponse({ msg: 'nope' }, 404));
    const client = createHttpClient(base);

    const err = await client.sendRequest({ url: '/x', method: 'GET' }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 404, statusText: expect.any(String), body: { msg: 'nope' } });
  });

  it('skipParsing bypasses schema validation', async () => {
    mockFetch(jsonResponse({ id: 'not-a-number' }));
    const client = createHttpClient({ ...base, skipParsing: true });

    const result = await client.sendRequest({ url: '/x', method: 'GET', schema: z.object({ id: z.number() }) });
    expect(result).toEqual({ id: 'not-a-number' });
  });

  it('softValidation parses a valid response strictly', async () => {
    mockFetch(jsonResponse({ id: 7 }));
    const client = createHttpClient({ ...base, softValidation: true });

    const result = await client.sendRequest({ url: '/x', method: 'GET', schema: z.object({ id: z.number() }) });
    expect(result).toEqual({ id: 7 });
  });

  it('softValidation passes a schema-mismatching response through raw instead of throwing', async () => {
    mockFetch(jsonResponse({ id: 'not-a-number' }));
    const client = createHttpClient({ ...base, softValidation: true });

    const result = await client.sendRequest({ url: '/x', method: 'GET', schema: z.object({ id: z.number() }) });
    expect(result).toEqual({ id: 'not-a-number' });
  });

  it('returns raw bytes for responseType "arraybuffer" and skips schema parsing', async () => {
    mockFetch(new Response(new Uint8Array([1, 2, 3]), { status: 200, headers: { 'Content-Type': 'application/octet-stream' } }));
    const client = createHttpClient(base);
    // A schema that would throw if applied — proves the arraybuffer path skips parsing.
    const strict = z.object({ nope: z.string() }) as unknown as z.ZodType<Uint8Array>;

    const result = await client.sendRequest({ url: '/x', method: 'GET', responseType: 'arraybuffer', schema: strict });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(Array.from(result)).toEqual([1, 2, 3]);
  });

  it('serializes array search params by repeating the key and drops undefined', async () => {
    const fetchMock = mockFetch(jsonResponse({}));
    const client = createHttpClient(base);

    await client.sendRequest({ url: '/x', method: 'GET', searchParams: { k: [1, 2], skip: undefined } });

    expect(fetchMock.mock.calls[0]![0]).toBe('https://x.example/rest/x?k=1&k=2');
  });

  it('aborts the request after the configured timeout', async () => {
    const prev = process.env.ATLASSIAN_DC_MCP_REQUEST_TIMEOUT_MS;
    process.env.ATLASSIAN_DC_MCP_REQUEST_TIMEOUT_MS = '1';
    global.fetch = vi.fn((_url: unknown, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
      }),
    ) as unknown as typeof fetch;
    const client = createHttpClient(base);

    await expect(client.sendRequest({ url: '/x', method: 'GET' })).rejects.toThrow(/abort/i);

    process.env.ATLASSIAN_DC_MCP_REQUEST_TIMEOUT_MS = prev;
  });

  it('captures the Retry-After header into ApiError on a 429', async () => {
    mockFetch(new Response('rate limited', { status: 429, statusText: 'Too Many Requests', headers: { 'Retry-After': '12' } }));
    const client = createHttpClient(base);

    await expect(client.sendRequest({ url: '/x', method: 'GET' })).rejects.toMatchObject({
      status: 429,
      retryAfterMs: 12000,
    });
  });
});

describe('parseRetryAfterMs', () => {
  it('parses delta-seconds into milliseconds', () => {
    expect(parseRetryAfterMs('120')).toBe(120000);
    expect(parseRetryAfterMs('0')).toBe(0);
  });

  it('returns undefined for a missing or unparseable value', () => {
    expect(parseRetryAfterMs(null)).toBeUndefined();
    expect(parseRetryAfterMs('soon')).toBeUndefined();
  });

  it('parses an HTTP-date into a non-negative delay from now', () => {
    const future = new Date(Date.now() + 60_000).toUTCString();
    const ms = parseRetryAfterMs(future);
    expect(ms).toBeGreaterThan(50_000);
    expect(ms).toBeLessThanOrEqual(60_000);
  });

  it('clamps a past HTTP-date to 0', () => {
    const past = new Date(Date.now() - 60_000).toUTCString();
    expect(parseRetryAfterMs(past)).toBe(0);
  });
});
