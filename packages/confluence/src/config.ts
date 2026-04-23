import {
  getProductRuntimeConfig,
  validateProductRuntimeConfig,
  type ProductDefinition,
} from '@atlassian-dc-mcp/common';

export const CONFLUENCE_PRODUCT: ProductDefinition = {
  id: 'confluence',
  envVars: {
    host: 'CONFLUENCE_HOST',
    apiBasePath: 'CONFLUENCE_API_BASE_PATH',
    token: 'CONFLUENCE_API_TOKEN',
    defaultPageSize: 'CONFLUENCE_DEFAULT_PAGE_SIZE',
  },
  defaultApiBasePath: '',
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
