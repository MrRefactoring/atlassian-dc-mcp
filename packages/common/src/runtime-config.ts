import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const FALLBACK_PAGE_SIZE = 25;

export const ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR = 'ATLASSIAN_DC_MCP_CONFIG_FILE';

export type AtlassianProduct = 'jira' | 'confluence' | 'bitbucket';

type ProductMetadata = {
  hostKey: string;
  apiBasePathKey: string;
  tokenKey: string;
  defaultPageSizeKey: string;
};

type ParsedEnvironment = Record<string, string>;

type RuntimeConfigState = {
  cwd: string;
  cachedFile?: {
    filePath: string;
    mtimeMs: number;
    values: ParsedEnvironment;
  };
};

export type ProductRuntimeConfig = {
  host?: string;
  apiBasePath?: string;
  token?: string;
  defaultPageSize: number;
};

const PRODUCT_METADATA: Record<AtlassianProduct, ProductMetadata> = {
  jira: {
    hostKey: 'JIRA_HOST',
    apiBasePathKey: 'JIRA_API_BASE_PATH',
    tokenKey: 'JIRA_API_TOKEN',
    defaultPageSizeKey: 'JIRA_DEFAULT_PAGE_SIZE',
  },
  confluence: {
    hostKey: 'CONFLUENCE_HOST',
    apiBasePathKey: 'CONFLUENCE_API_BASE_PATH',
    tokenKey: 'CONFLUENCE_API_TOKEN',
    defaultPageSizeKey: 'CONFLUENCE_DEFAULT_PAGE_SIZE',
  },
  bitbucket: {
    hostKey: 'BITBUCKET_HOST',
    apiBasePathKey: 'BITBUCKET_API_BASE_PATH',
    tokenKey: 'BITBUCKET_API_TOKEN',
    defaultPageSizeKey: 'BITBUCKET_DEFAULT_PAGE_SIZE',
  },
};

const runtimeConfigState: RuntimeConfigState = {
  cwd: process.cwd(),
};

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return undefined;
  }

  const parsed = Number.parseInt(trimmed, 10);
  return parsed > 0 ? parsed : undefined;
}

function getNonEmptyValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getExplicitConfigFilePath(): string | undefined {
  const filePath = getNonEmptyValue(process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR]);
  if (!filePath) {
    return undefined;
  }

  if (!path.isAbsolute(filePath)) {
    throw new Error(`${ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR} must be an absolute path: ${filePath}`);
  }

  return filePath;
}

function clearCachedFileIfNeeded(filePath: string) {
  if (runtimeConfigState.cachedFile?.filePath === filePath) {
    runtimeConfigState.cachedFile = undefined;
  }
}

function getParsedFileEnvironment(): ParsedEnvironment {
  const explicitFilePath = getExplicitConfigFilePath();
  const filePath = explicitFilePath ?? path.join(runtimeConfigState.cwd, '.env');

  let stats: fs.Stats;
  try {
    stats = fs.statSync(filePath);
  } catch (error) {
    clearCachedFileIfNeeded(filePath);

    if ((error as NodeJS.ErrnoException).code === 'ENOENT' && !explicitFilePath) {
      return {};
    }

    if ((error as NodeJS.ErrnoException).code === 'ENOENT' && explicitFilePath) {
      throw new Error(`${ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR} points to a missing file: ${filePath}`);
    }

    throw error;
  }

  const cachedFile = runtimeConfigState.cachedFile;
  if (cachedFile && cachedFile.filePath === filePath && cachedFile.mtimeMs === stats.mtimeMs) {
    return cachedFile.values;
  }

  const values = dotenv.parse(fs.readFileSync(filePath));
  runtimeConfigState.cachedFile = {
    filePath,
    mtimeMs: stats.mtimeMs,
    values,
  };
  return values;
}

function getMergedEnvironment(): NodeJS.ProcessEnv {
  return {
    ...getParsedFileEnvironment(),
    ...process.env,
  };
}

export function initializeRuntimeConfig(options?: { cwd?: string }) {
  runtimeConfigState.cwd = options?.cwd ?? process.cwd();
  getParsedFileEnvironment();
}

export function getProductRuntimeConfig(product: AtlassianProduct): ProductRuntimeConfig {
  const environment = getMergedEnvironment();
  const metadata = PRODUCT_METADATA[product];

  return {
    host: getNonEmptyValue(environment[metadata.hostKey]),
    apiBasePath: getNonEmptyValue(environment[metadata.apiBasePathKey]),
    token: getNonEmptyValue(environment[metadata.tokenKey]),
    defaultPageSize: parsePositiveInteger(environment[metadata.defaultPageSizeKey]) ?? FALLBACK_PAGE_SIZE,
  };
}

export function validateProductRuntimeConfig(product: AtlassianProduct): string[] {
  const metadata = PRODUCT_METADATA[product];
  const config = getProductRuntimeConfig(product);
  const missing: string[] = [];

  if (!config.token) {
    missing.push(metadata.tokenKey);
  }

  if (!config.host && !config.apiBasePath) {
    missing.push(`${metadata.hostKey} or ${metadata.apiBasePathKey}`);
  }

  return missing;
}
