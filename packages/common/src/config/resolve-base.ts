export type ResolveOpenApiBaseOptions = {
  host?: string;
  apiBasePath?: string;
  defaultBasePath: string;
  strippableSuffixes?: readonly string[];
};

function normalizeHost(host: string): string {
  const withScheme = /^https?:\/\//i.test(host) ? host : `https://${host}`;
  return withScheme.replace(/\/+$/, '');
}

function stripGeneratedSuffix(path: string, suffixes: readonly string[]): string {
  for (const suffix of suffixes) {
    const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`${escaped}\\/?$`, 'i');
    if (re.test(path)) {
      return path.replace(re, '');
    }
  }
  return path;
}

export function resolveOpenApiBase(options: ResolveOpenApiBaseOptions): string {
  const { host, apiBasePath, defaultBasePath, strippableSuffixes = [] } = options;

  if (apiBasePath && /^https?:\/\//i.test(apiBasePath)) {
    return apiBasePath.replace(/\/+$/, '');
  }

  if (!host) {
    throw new Error('host or apiBasePath must be provided');
  }

  const basePath = apiBasePath ? stripGeneratedSuffix(apiBasePath, strippableSuffixes) : defaultBasePath;
  return `${normalizeHost(host)}${basePath}`;
}
