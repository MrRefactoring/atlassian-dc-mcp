import type { OnCancel } from '../jira-client/core/CancelablePromise.js';
import { sendRequest } from '../jira-client/core/request.js';
import type { OpenAPIConfig } from '../jira-client/core/OpenAPI.js';

function makeOnCancel(): OnCancel {
  const onCancel = jest.fn() as unknown as OnCancel;
  Object.defineProperties(onCancel, {
    isResolved: { get: () => false },
    isRejected: { get: () => false },
    isCancelled: { get: () => false },
  });
  return onCancel;
}

describe('jira request timeout', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = originalEnv;
  });

  it('aborts fetch after the configured request timeout', async () => {
    process.env = { ...originalEnv, ATLASSIAN_DC_MCP_REQUEST_TIMEOUT_MS: '1' };
    const fetchMock = jest.fn((_url: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        });
      });
    }) as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock;

    const config: OpenAPIConfig = {
      BASE: 'https://jira.example.com/rest',
      VERSION: '2',
      WITH_CREDENTIALS: false,
      CREDENTIALS: 'include',
    };

    await expect(sendRequest(
      config,
      { method: 'GET', url: '/api/2/myself' },
      'https://jira.example.com/rest/api/2/myself',
      undefined,
      undefined,
      new Headers(),
      makeOnCancel(),
    )).rejects.toMatchObject({ name: 'AbortError' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
