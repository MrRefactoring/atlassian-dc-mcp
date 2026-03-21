import { getProductRuntimeConfig, validateProductRuntimeConfig } from '@atlassian-dc-mcp/common';

export function getConfluenceRuntimeConfig() {
  return getProductRuntimeConfig('confluence');
}

export function getDefaultPageSize() {
  return getConfluenceRuntimeConfig().defaultPageSize;
}

export function getMissingConfig() {
  return validateProductRuntimeConfig('confluence');
}
