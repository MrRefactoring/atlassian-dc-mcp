import {
  getProductRuntimeConfig,
  validateProductRuntimeConfig,
  type ProductDefinition,
} from '@atlassian-dc-mcp/common';

export const JIRA_PRODUCT: ProductDefinition = {
  id: 'jira',
  envVars: {
    host: 'JIRA_HOST',
    apiBasePath: 'JIRA_API_BASE_PATH',
    token: 'JIRA_API_TOKEN',
    defaultPageSize: 'JIRA_DEFAULT_PAGE_SIZE',
  },
  defaultApiBasePath: '/rest',
  apiBasePathStrippableSuffixes: ['/api/2'],
};

export function getJiraRuntimeConfig() {
  return getProductRuntimeConfig(JIRA_PRODUCT);
}

export function getDefaultPageSize() {
  return getJiraRuntimeConfig().defaultPageSize;
}

export function getMissingConfig() {
  return validateProductRuntimeConfig(JIRA_PRODUCT);
}
