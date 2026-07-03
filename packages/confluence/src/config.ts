import {
  getProductRuntimeConfig,
  validateProductRuntimeConfig,
  type ProductDefinition,
} from 'datacenter-mcp-core';

export const CONFLUENCE_PRODUCT: ProductDefinition = {
  id: 'confluence',
  envVars: {
    host: 'CONFLUENCE_HOST',
    apiBasePath: 'CONFLUENCE_API_BASE_PATH',
    token: 'CONFLUENCE_API_TOKEN',
    username: 'CONFLUENCE_USERNAME',
    password: 'CONFLUENCE_PASSWORD',
    defaultPageSize: 'CONFLUENCE_DEFAULT_PAGE_SIZE',
  },
  defaultApiBasePath: '',
  apiBasePathStrippableSuffixes: ['/rest/api', '/rest'],
};

export function getConfluenceRuntimeConfig() {
  return getProductRuntimeConfig(CONFLUENCE_PRODUCT);
}

export function getDefaultPageSize() {
  return getConfluenceRuntimeConfig().defaultPageSize;
}

export function getMissingConfig() {
  return validateProductRuntimeConfig(CONFLUENCE_PRODUCT);
}
