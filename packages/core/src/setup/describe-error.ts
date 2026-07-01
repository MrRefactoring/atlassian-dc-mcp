const NETWORK_CODE_HINTS: Record<string, string> = {
  ENOTFOUND: 'could not resolve host',
  EAI_AGAIN: 'DNS lookup temporarily failed',
  ECONNREFUSED: 'connection refused',
  ECONNRESET: 'connection reset by peer',
  ETIMEDOUT: 'connection timed out',
  ECONNABORTED: 'connection aborted',
  EHOSTUNREACH: 'host is unreachable',
  ENETUNREACH: 'network is unreachable',
  EPROTO: 'TLS protocol error',
  CERT_HAS_EXPIRED: 'server TLS certificate has expired',
  DEPTH_ZERO_SELF_SIGNED_CERT: 'server uses a self-signed TLS certificate',
  SELF_SIGNED_CERT_IN_CHAIN: 'server TLS certificate chain is self-signed',
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: 'server TLS certificate could not be verified',
  ERR_TLS_CERT_ALTNAME_INVALID: 'server TLS certificate does not match the host name',
};

type ApiLikeError = {
  status: number;
  statusText?: string;
  url?: string;
  body?: unknown;
};

type CauseLikeError = {
  code?: string;
  message?: string;
};

export function describeValidationError(error: unknown): string {
  if (isApiLikeError(error)) {
    return formatApiError(error);
  }
  if (isAbortError(error)) {
    return 'request was aborted (possibly timed out)';
  }

  const err = error as { message?: string; cause?: CauseLikeError } | undefined;
  const cause = err?.cause;
  if (cause?.code) {
    const hint = NETWORK_CODE_HINTS[cause.code] ?? 'network error';
    const detail = cause.message ?? err?.message ?? 'unknown';
    return `${hint} (${cause.code}: ${detail})`;
  }

  return err?.message ?? String(error);
}

function formatApiError(error: ApiLikeError): string {
  const status = `${error.status}${error.statusText ? ` ${error.statusText}` : ''}`.trim();
  const url = error.url ? `${error.url} ` : '';
  const hint = status.startsWith('401') || status.startsWith('403')
    ? ' Check the host, API base path, and API token.'
    : '';
  return `${url}returned ${status}.${hint}`.trim();
}

function isApiLikeError(error: unknown): error is ApiLikeError {
  return Boolean(error)
    && typeof error === 'object'
    && 'status' in (error as object)
    && typeof (error as ApiLikeError).status === 'number';
}

function isAbortError(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && (error as { name?: string }).name === 'AbortError');
}
