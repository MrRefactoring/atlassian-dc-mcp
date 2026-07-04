import { buildDefaultRegistry, type ConfigRegistry } from './registry.js';
import { getNonEmptyValue, type ConfigKey, type ProductDefinition } from './source.js';

const FALLBACK_PAGE_SIZE = 25;

export type ProductRuntimeConfig = {
  host?: string;
  apiBasePath?: string;
  token?: string;
  username?: string;
  password?: string;
  defaultPageSize: number;
};

export { ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR } from './sources/envFile.js';

/**
 * Selects a named profile for the persisted-storage layer (home file + macOS
 * Keychain), so `setup` can save more than one instance's credentials per
 * product without them colliding — e.g. `ATLASSIAN_DC_MCP_PROFILE=work` reads
 * from/writes to `~/.atlassian-dc-mcp/jira.work.env` and the `jira-work-token`
 * Keychain account instead of the unsuffixed defaults. process.env and
 * `ATLASSIAN_DC_MCP_CONFIG_FILE` are unaffected — point separate processes at
 * separate explicit files/env vars for those, as already supported.
 */
export const ATLASSIAN_DC_MCP_PROFILE_ENV_VAR = 'ATLASSIAN_DC_MCP_PROFILE';

function getActiveProfile(): string | undefined {
  return getNonEmptyValue(process.env[ATLASSIAN_DC_MCP_PROFILE_ENV_VAR]);
}

const registry: ConfigRegistry = buildDefaultRegistry({ profile: getActiveProfile() });

export function initializeRuntimeConfig(options?: { cwd?: string }): void {
  registry.initialize(options);
}

function resolveString(product: ProductDefinition, key: ConfigKey): string | undefined {
  return registry.resolve(product, key).value;
}

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

export function getProductRuntimeConfig(product: ProductDefinition): ProductRuntimeConfig {
  return {
    host: resolveString(product, 'host'),
    apiBasePath: resolveString(product, 'apiBasePath'),
    token: resolveString(product, 'token'),
    username: resolveString(product, 'username'),
    password: resolveString(product, 'password'),
    defaultPageSize:
      parsePositiveInteger(resolveString(product, 'defaultPageSize')) ?? FALLBACK_PAGE_SIZE,
  };
}

export function validateProductRuntimeConfig(product: ProductDefinition): string[] {
  const config = getProductRuntimeConfig(product);
  const missing: string[] = [];

  if (!config.host && !config.apiBasePath) {
    missing.push(`${product.envVars.host} or ${product.envVars.apiBasePath}`);
  }

  return missing;
}
