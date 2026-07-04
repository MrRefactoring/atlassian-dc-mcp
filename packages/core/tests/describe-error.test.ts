import { describeValidationError } from '../setup/describe-error.js';

describe('describeValidationError', () => {
  it('formats HTTP errors with status, URL, and a 401 hint', () => {
    const apiError = {
      name: 'ApiError',
      status: 401,
      statusText: 'Unauthorized',
      url: 'https://jira.example.com/rest/api/2/myself',
      body: {},
    };
    expect(describeValidationError(apiError)).toBe(
      'https://jira.example.com/rest/api/2/myself returned 401 Unauthorized. Check the host, API base path, and API token.',
    );
  });

  it('formats non-auth HTTP errors without the auth hint', () => {
    const apiError = {
      name: 'ApiError',
      status: 500,
      statusText: 'Internal Server Error',
      url: 'https://jira.example.com/rest/api/2/myself',
    };
    expect(describeValidationError(apiError)).toBe(
      'https://jira.example.com/rest/api/2/myself returned 500 Internal Server Error.',
    );
  });

  it('unwraps Node fetch TypeErrors with ECONNREFUSED via cause', () => {
    const error = Object.assign(new TypeError('fetch failed'), {
      cause: Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:443'), {
        code: 'ECONNREFUSED',
      }),
    });
    expect(describeValidationError(error)).toBe(
      'connection refused (ECONNREFUSED: connect ECONNREFUSED 127.0.0.1:443)',
    );
  });

  it('unwraps DNS failures as ENOTFOUND', () => {
    const error = Object.assign(new TypeError('fetch failed'), {
      cause: Object.assign(new Error('getaddrinfo ENOTFOUND jira.nope'), {
        code: 'ENOTFOUND',
      }),
    });
    expect(describeValidationError(error)).toBe(
      'could not resolve host (ENOTFOUND: getaddrinfo ENOTFOUND jira.nope)',
    );
  });

  it('recognises self-signed certificate errors', () => {
    const error = Object.assign(new TypeError('fetch failed'), {
      cause: Object.assign(new Error('self-signed certificate'), {
        code: 'DEPTH_ZERO_SELF_SIGNED_CERT',
      }),
    });
    expect(describeValidationError(error)).toBe(
      'server uses a self-signed TLS certificate (DEPTH_ZERO_SELF_SIGNED_CERT: self-signed certificate)',
    );
  });

  it('describes aborted requests', () => {
    const error = Object.assign(new Error('aborted'), { name: 'AbortError' });
    expect(describeValidationError(error)).toBe('request was aborted (possibly timed out)');
  });

  it('falls back to the raw message when nothing else matches', () => {
    expect(describeValidationError(new Error('something weird'))).toBe('something weird');
  });
});
