import { getProductRuntimeConfig, validateProductRuntimeConfig } from '@atlassian-dc-mcp/common';

export function getBitbucketRuntimeConfig() {
  return getProductRuntimeConfig('bitbucket');
}

export function getDefaultPageSize() {
  return getBitbucketRuntimeConfig().defaultPageSize;
}

export function getMissingConfig() {
  return validateProductRuntimeConfig('bitbucket');
}
