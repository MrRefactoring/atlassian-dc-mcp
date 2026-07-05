import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerAdminTools(server: McpServer, service: JiraService) {
  server.tool(
    'jira_createFilter',
    `Create a saved search filter in the ${jiraInstanceType}`,
    jiraToolSchemas.createFilter,
    async ({ name, jql, description, favourite }) => {
      const result = await service.createFilter(name, jql, description, favourite);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getFilter',
    `Get a saved search filter by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getFilter,
    async ({ filterId, expand }) => {
      const result = await service.getFilter(filterId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateFilter',
    `Update a saved search filter in the ${jiraInstanceType}`,
    jiraToolSchemas.updateFilter,
    async ({ filterId, name, jql, description, favourite }) => {
      const result = await service.updateFilter(filterId, name, jql, description, favourite);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteFilter',
    `Delete a saved search filter from the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteFilter,
    async ({ filterId }) => {
      const result = await service.deleteFilter(filterId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getFavouriteFilters',
    `Get the current user's favourite saved search filters in the ${jiraInstanceType}`,
    jiraToolSchemas.getFavouriteFilters,
    async () => {
      const result = await service.getFavouriteFilters();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getDashboards',
    `Get a list of dashboards visible to the current user in the ${jiraInstanceType}`,
    jiraToolSchemas.getDashboards,
    async ({ filter, maxResults, startAt }) => {
      const result = await service.getDashboards(filter, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getDashboard',
    `Get a single dashboard by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getDashboard,
    async ({ dashboardId }) => {
      const result = await service.getDashboard(dashboardId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueTypeSchemes',
    `Get all issue type schemes visible to the user in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueTypeSchemes,
    async () => {
      const result = await service.getIssueTypeSchemes();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createIssueTypeScheme',
    `Create a new issue type scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.createIssueTypeScheme,
    async ({ name, description, issueTypeIds, defaultIssueTypeId }) => {
      const result = await service.createIssueTypeScheme(name, description, issueTypeIds, defaultIssueTypeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueTypeScheme',
    `Get a single issue type scheme by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueTypeScheme,
    async ({ schemeId }) => {
      const result = await service.getIssueTypeScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateIssueTypeScheme',
    `Update an issue type scheme's name, description, or issue types in the ${jiraInstanceType}`,
    jiraToolSchemas.updateIssueTypeScheme,
    async ({ schemeId, name, description, issueTypeIds, defaultIssueTypeId }) => {
      const result = await service.updateIssueTypeScheme(schemeId, name, description, issueTypeIds, defaultIssueTypeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteIssueTypeScheme',
    `Delete an issue type scheme in the ${jiraInstanceType}. Associated projects fall back to the default scheme.`,
    jiraToolSchemas.deleteIssueTypeScheme,
    async ({ schemeId }) => {
      const result = await service.deleteIssueTypeScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueTypeSchemeProjects',
    `Get the projects associated with an issue type scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueTypeSchemeProjects,
    async ({ schemeId, expand }) => {
      const result = await service.getIssueTypeSchemeProjects(schemeId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setIssueTypeSchemeProjects',
    `Replace the project associations of an issue type scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.setIssueTypeSchemeProjects,
    async ({ schemeId, idsOrKeys }) => {
      const result = await service.setIssueTypeSchemeProjects(schemeId, idsOrKeys);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addIssueTypeSchemeProjects',
    `Add project associations to an issue type scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.addIssueTypeSchemeProjects,
    async ({ schemeId, idsOrKeys }) => {
      const result = await service.addIssueTypeSchemeProjects(schemeId, idsOrKeys);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_removeIssueTypeSchemeProjects',
    `Remove all project associations from an issue type scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.removeIssueTypeSchemeProjects,
    async ({ schemeId }) => {
      const result = await service.removeIssueTypeSchemeProjects(schemeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_removeIssueTypeSchemeProject',
    `Remove a single project association from an issue type scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.removeIssueTypeSchemeProject,
    async ({ schemeId, projIdOrKey }) => {
      const result = await service.removeIssueTypeSchemeProject(schemeId, projIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getPrioritySchemes',
    `Get all priority schemes in the ${jiraInstanceType}`,
    jiraToolSchemas.getPrioritySchemes,
    async ({ maxResults, startAt }) => {
      const result = await service.getPrioritySchemes(maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createPriorityScheme',
    `Create a new priority scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.createPriorityScheme,
    async ({ name, description, defaultOptionId, optionIds }) => {
      const result = await service.createPriorityScheme(name, description, defaultOptionId, optionIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getPriorityScheme',
    `Get a single priority scheme by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getPriorityScheme,
    async ({ schemeId }) => {
      const result = await service.getPriorityScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updatePriorityScheme',
    `Update a priority scheme's name, description, or priorities in the ${jiraInstanceType}`,
    jiraToolSchemas.updatePriorityScheme,
    async ({ schemeId, name, description, defaultOptionId, optionIds }) => {
      const result = await service.updatePriorityScheme(schemeId, name, description, defaultOptionId, optionIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deletePriorityScheme',
    `Delete a priority scheme in the ${jiraInstanceType}. Projects using it fall back to the default priority scheme.`,
    jiraToolSchemas.deletePriorityScheme,
    async ({ schemeId }) => {
      const result = await service.deletePriorityScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getPermissionSchemes',
    `Get all permission schemes in the ${jiraInstanceType}`,
    jiraToolSchemas.getPermissionSchemes,
    async ({ expand }) => {
      const result = await service.getPermissionSchemes(expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getPermissionScheme',
    `Get a single permission scheme by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getPermissionScheme,
    async ({ schemeId, expand }) => {
      const result = await service.getPermissionScheme(schemeId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createPermissionScheme',
    `Create a new permission scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.createPermissionScheme,
    async ({ name, description, permissions }) => {
      const result = await service.createPermissionScheme(name, description, permissions);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updatePermissionScheme',
    `Update a permission scheme's name, description, or permission grants in the ${jiraInstanceType}`,
    jiraToolSchemas.updatePermissionScheme,
    async ({ schemeId, name, description, permissions }) => {
      const result = await service.updatePermissionScheme(schemeId, name, description, permissions);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deletePermissionScheme',
    `Delete a permission scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.deletePermissionScheme,
    async ({ schemeId }) => {
      const result = await service.deletePermissionScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getPermissionSchemeGrants',
    `Get all permission grants of a permission scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.getPermissionSchemeGrants,
    async ({ schemeId, expand }) => {
      const result = await service.getPermissionSchemeGrants(schemeId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createPermissionGrant',
    `Create a permission grant in a permission scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.createPermissionGrant,
    async ({ schemeId, permission, holderType, holderParameter }) => {
      const result = await service.createPermissionGrant(schemeId, permission, holderType, holderParameter);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deletePermissionGrant',
    `Delete a permission grant from a permission scheme in the ${jiraInstanceType}`,
    jiraToolSchemas.deletePermissionGrant,
    async ({ schemeId, permissionId }) => {
      const result = await service.deletePermissionGrant(schemeId, permissionId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getApplicationRoles',
    `Get all application roles (e.g. jira-software, jira-servicedesk) in the ${jiraInstanceType}. Read-only catalog of licensed applications.`,
    jiraToolSchemas.getApplicationRoles,
    async () => {
      const result = await service.getApplicationRoles();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getApplicationRole',
    `Get a single application role by key from the ${jiraInstanceType}. Use jira_getApplicationRoles to find valid keys.`,
    jiraToolSchemas.getApplicationRole,
    async ({ key }) => {
      const result = await service.getApplicationRole(key);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getNotificationSchemes',
    `Get a paginated list of notification schemes in the ${jiraInstanceType}`,
    jiraToolSchemas.getNotificationSchemes,
    async ({ expand, maxResults, startAt }) => {
      const result = await service.getNotificationSchemes(expand, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getNotificationScheme',
    `Get full details of a notification scheme by id in the ${jiraInstanceType}`,
    jiraToolSchemas.getNotificationScheme,
    async ({ id, expand }) => {
      const result = await service.getNotificationScheme(id, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getSecurityLevel',
    `Get an issue security level by id in the ${jiraInstanceType}`,
    jiraToolSchemas.getSecurityLevel,
    async ({ id }) => {
      const result = await service.getSecurityLevel(id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueSecuritySchemes',
    `Get all issue security schemes in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueSecuritySchemes,
    async () => {
      const result = await service.getIssueSecuritySchemes();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueSecurityScheme',
    `Get an issue security scheme by id in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueSecurityScheme,
    async ({ id }) => {
      const result = await service.getIssueSecurityScheme(id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCustomFields',
    `Get a paginated, filterable list of custom fields in the ${jiraInstanceType}`,
    jiraToolSchemas.getCustomFields,
    async ({ sortColumn, types, search, maxResults, sortOrder, screenIds, lastValueUpdate, projectIds, startAt }) => {
      const result = await service.getCustomFields(sortColumn, types, search, maxResults, sortOrder, screenIds, lastValueUpdate, projectIds, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteCustomFields',
    `Delete custom fields in bulk in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteCustomFields,
    async ({ ids }) => {
      const result = await service.deleteCustomFields(ids);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCustomFieldOptions',
    `Get a custom field's options defined in a given context of projects and issue types in the ${jiraInstanceType}`,
    jiraToolSchemas.getCustomFieldOptions,
    async ({ customFieldId, maxResults, issueTypeIds, query, sortByOptionName, useAllContexts, page, projectIds }) => {
      const result = await service.getCustomFieldOptions(customFieldId, maxResults, issueTypeIds, query, sortByOptionName, useAllContexts, page, projectIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCustomFieldOption',
    `Get a custom field option by id in the ${jiraInstanceType}`,
    jiraToolSchemas.getCustomFieldOption,
    async ({ id }) => {
      const result = await service.getCustomFieldOption(id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createCustomField',
    `Create a new custom field in the ${jiraInstanceType}`,
    jiraToolSchemas.createCustomField,
    async ({ name, type, description, searcherKey, issueTypeIds, projectIds }) => {
      const result = await service.createCustomField(name, type, description, searcherKey, issueTypeIds, projectIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getJqlAutocompleteData',
    `Get the reserved words, visible field names, and function names available for building JQL queries in the ${jiraInstanceType}`,
    jiraToolSchemas.getJqlAutocompleteData,
    async () => {
      const result = await service.getJqlAutocompleteData();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getJqlFieldAutocomplete',
    `Get value autocomplete suggestions for a JQL field while building a query in the ${jiraInstanceType}. Useful before calling jira_searchIssues to discover valid field values.`,
    jiraToolSchemas.getJqlFieldAutocomplete,
    async ({ fieldName, fieldValue, predicateName, predicateValue }) => {
      const result = await service.getJqlFieldAutocomplete(fieldName, fieldValue, predicateName, predicateValue);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_validateProjectKey',
    `Validate a candidate project key in the ${jiraInstanceType} before creating a new project. Returns any validation errors; an empty result means the key is valid.`,
    jiraToolSchemas.validateProjectKey,
    async ({ key }) => {
      const result = await service.validateProjectKey(key);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getServerInfo',
    `Get general information about the current ${jiraInstanceType} server, including version, build number, and deployment type`,
    jiraToolSchemas.getServerInfo,
    async () => {
      const result = await service.getServerInfo();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_validateLicense',
    `Validate a license string against the current ${jiraInstanceType} server installation`,
    jiraToolSchemas.validateLicense,
    async ({ licenseString }) => {
      const result = await service.validateLicense(licenseString);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getApplicationProperty',
    `Get an application property by key from the ${jiraInstanceType}`,
    jiraToolSchemas.getApplicationProperty,
    async ({ permissionLevel, key, keyFilter }) => {
      const result = await service.getApplicationProperty(permissionLevel, key, keyFilter);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getAdvancedSettings',
    `Get all advanced settings application properties (General Configuration > Advanced Settings) in the ${jiraInstanceType}`,
    jiraToolSchemas.getAdvancedSettings,
    async () => {
      const result = await service.getAdvancedSettings();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setApplicationProperty',
    `Update an application property's value in the ${jiraInstanceType}`,
    jiraToolSchemas.setApplicationProperty,
    async ({ id, value }) => {
      const result = await service.setApplicationProperty(id, value);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getClusterNodes',
    `Get all nodes in the cluster in the ${jiraInstanceType}`,
    jiraToolSchemas.getClusterNodes,
    async () => {
      const result = await service.getClusterNodes();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteClusterNode',
    `Delete an OFFLINE node from the cluster in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteClusterNode,
    async ({ nodeId }) => {
      const result = await service.deleteClusterNode(nodeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setClusterNodeOffline',
    `Change a cluster node's state to OFFLINE in the ${jiraInstanceType}`,
    jiraToolSchemas.setClusterNodeOffline,
    async ({ nodeId }) => {
      const result = await service.setClusterNodeOffline(nodeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_requestClusterNodeIndexSnapshot',
    `Request an index snapshot from a cluster node in the ${jiraInstanceType} (deprecated, Lucene-specific, planned for removal in Jira 11)`,
    jiraToolSchemas.requestClusterNodeIndexSnapshot,
    async ({ nodeId }) => {
      const result = await service.requestClusterNodeIndexSnapshot(nodeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_approveClusterUpgrade',
    `Approve an ongoing zero-downtime cluster upgrade in the ${jiraInstanceType}`,
    jiraToolSchemas.approveClusterUpgrade,
    async () => {
      const result = await service.approveClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_cancelClusterUpgrade',
    `Cancel an ongoing zero-downtime cluster upgrade in the ${jiraInstanceType}`,
    jiraToolSchemas.cancelClusterUpgrade,
    async () => {
      const result = await service.cancelClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_retryClusterUpgrade',
    `Retry a failed zero-downtime cluster upgrade in the ${jiraInstanceType}`,
    jiraToolSchemas.retryClusterUpgrade,
    async () => {
      const result = await service.retryClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_startClusterUpgrade',
    `Start a zero-downtime cluster upgrade in the ${jiraInstanceType}`,
    jiraToolSchemas.startClusterUpgrade,
    async () => {
      const result = await service.startClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getClusterUpgradeState',
    `Get the current state of the zero-downtime cluster upgrade in the ${jiraInstanceType}`,
    jiraToolSchemas.getClusterUpgradeState,
    async () => {
      const result = await service.getClusterUpgradeState();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIndexSummary',
    `Get a summary of the issue index condition of the current node in the ${jiraInstanceType}`,
    jiraToolSchemas.getIndexSummary,
    async () => {
      const result = await service.getIndexSummary();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_listIndexSnapshots',
    `List available index snapshots (absolute paths with timestamps) in the ${jiraInstanceType}`,
    jiraToolSchemas.listIndexSnapshots,
    async () => {
      const result = await service.listIndexSnapshots();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createIndexSnapshot',
    `Start creating an index snapshot, if none is already in progress, in the ${jiraInstanceType}`,
    jiraToolSchemas.createIndexSnapshot,
    async () => {
      const result = await service.createIndexSnapshot();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIndexSnapshotStatus',
    `Check whether index snapshot creation is currently running in the ${jiraInstanceType}`,
    jiraToolSchemas.getIndexSnapshotStatus,
    async () => {
      const result = await service.getIndexSnapshotStatus();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getReindexInfo',
    `Get information on the active or most recent system reindex in the ${jiraInstanceType}`,
    jiraToolSchemas.getReindexInfo,
    async ({ taskId }) => {
      const result = await service.getReindexInfo(taskId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_startReindex',
    `Kick off a full system reindex in the ${jiraInstanceType}. Requires admin permissions.`,
    jiraToolSchemas.startReindex,
    async ({ indexChangeHistory, type, indexWorklogs, indexComments }) => {
      const result = await service.startReindex(indexChangeHistory, type, indexWorklogs, indexComments);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_reindexIssues',
    `Synchronously reindex one or more individual issues in the ${jiraInstanceType}`,
    jiraToolSchemas.reindexIssues,
    async ({ issueIds, indexChangeHistory, indexWorklogs, indexComments }) => {
      const result = await service.reindexIssues(issueIds, indexChangeHistory, indexWorklogs, indexComments);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getReindexProgress',
    `Get progress information on the active or most recent system reindex in the ${jiraInstanceType}`,
    jiraToolSchemas.getReindexProgress,
    async ({ taskId }) => {
      const result = await service.getReindexProgress(taskId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_processReindexRequests',
    `Execute any pending reindex requests in the ${jiraInstanceType}`,
    jiraToolSchemas.processReindexRequests,
    async () => {
      const result = await service.processReindexRequests();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getReindexRequestsProgress',
    `Get the progress of multiple reindex requests in the ${jiraInstanceType}`,
    jiraToolSchemas.getReindexRequestsProgress,
    async ({ requestIds }) => {
      const result = await service.getReindexRequestsProgress(requestIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getReindexRequestProgress',
    `Get the progress of a single reindex request in the ${jiraInstanceType}`,
    jiraToolSchemas.getReindexRequestProgress,
    async ({ requestId }) => {
      const result = await service.getReindexRequestProgress(requestId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_downloadEmailTemplates',
    `Download the current email templates as a base64-encoded zip file from the ${jiraInstanceType}`,
    jiraToolSchemas.downloadEmailTemplates,
    async () => {
      const result = await service.downloadEmailTemplates();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_uploadEmailTemplates',
    `Upload a base64-encoded zip file of email templates to a temporary folder in the ${jiraInstanceType}. Call jira_applyEmailTemplates to make it active.`,
    jiraToolSchemas.uploadEmailTemplates,
    async ({ contentBase64 }) => {
      const result = await service.uploadEmailTemplates(contentBase64);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_applyEmailTemplates',
    `Replace the current email templates with the previously uploaded pack in the ${jiraInstanceType}`,
    jiraToolSchemas.applyEmailTemplates,
    async () => {
      const result = await service.applyEmailTemplates();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_resetEmailTemplatesToDefault',
    `Replace the current email templates with the default templates shipped with the ${jiraInstanceType}`,
    jiraToolSchemas.resetEmailTemplatesToDefault,
    async () => {
      const result = await service.resetEmailTemplatesToDefault();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getEmailTemplateTypes',
    `Get the list of root email templates mapped to event types in the ${jiraInstanceType}`,
    jiraToolSchemas.getEmailTemplateTypes,
    async () => {
      const result = await service.getEmailTemplateTypes();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCurrentSession',
    `Get information about the currently authenticated user's session in the ${jiraInstanceType}`,
    jiraToolSchemas.getCurrentSession,
    async () => {
      const result = await service.getCurrentSession();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createSession',
    `Create a new authenticated session in the ${jiraInstanceType} using a username and password`,
    jiraToolSchemas.createSession,
    async ({ username, password }) => {
      const result = await service.createSession(username, password);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteSession',
    `Log out the current user, destroying their session, in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteSession,
    async () => {
      const result = await service.deleteSession();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_releaseWebSudo',
    `Invalidate the current WebSudo (elevated permission) session in the ${jiraInstanceType}`,
    jiraToolSchemas.releaseWebSudo,
    async () => {
      const result = await service.releaseWebSudo();

      return formatToolResponse(result);
    },
  );
}
