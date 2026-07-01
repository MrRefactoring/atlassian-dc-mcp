import { buildDefaultRegistry, type ConfigRegistry } from './registry.js';
import type { ConfigKey, ProductDefinition } from './source.js';

const FALLBACK_PAGE_SIZE = 25;

export type ProductRuntimeConfig = {
  host?: string;
  apiBasePath?: string;
  token?: string;
  defaultPageSize: number;
};

export { ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR } from './sources/env-file.js';

let registry: ConfigRegistry = buildDefaultRegistry();

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
    defaultPageSize:
      parsePositiveInteger(resolveString(product, 'defaultPageSize')) ?? FALLBACK_PAGE_SIZE,
  };
}

export function validateProductRuntimeConfig(product: ProductDefinition): string[] {
  const config = getProductRuntimeConfig(product);
  const missing: string[] = [];

  if (!config.token) {
    missing.push(product.envVars.token);
  }

  if (!config.host && !config.apiBasePath) {
    missing.push(`${product.envVars.host} or ${product.envVars.apiBasePath}`);
  }

  return missing;
}
