import {
  getProductRuntimeConfig,
  validateProductRuntimeConfig,
  type ProductDefinition,
} from '@atlassian-dc-mcp/common';

export const BITBUCKET_PRODUCT: ProductDefinition = {
  id: 'bitbucket',
  envVars: {
    host: 'BITBUCKET_HOST',
    apiBasePath: 'BITBUCKET_API_BASE_PATH',
    token: 'BITBUCKET_API_TOKEN',
    defaultPageSize: 'BITBUCKET_DEFAULT_PAGE_SIZE',
  },
  defaultApiBasePath: '/rest',
};

export function getBitbucketRuntimeConfig() {
  return getProductRuntimeConfig(BITBUCKET_PRODUCT);
}

export function getDefaultPageSize() {
  return getBitbucketRuntimeConfig().defaultPageSize;
}

export function getMissingConfig() {
  return validateProductRuntimeConfig(BITBUCKET_PRODUCT);
}
