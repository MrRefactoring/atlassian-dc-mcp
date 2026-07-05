import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerAdminTools(server: McpServer, service: JiraService) {
  server.registerTool(
    'jira_createFilter',
    {
      description: `Create a saved search filter in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createFilter,
    },
    async ({ name, jql, description, favourite }) => {
      const result = await service.createFilter(name, jql, description, favourite);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getFilter',
    {
      description: `Get a saved search filter by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getFilter,
    },
    async ({ filterId, expand }) => {
      const result = await service.getFilter(filterId, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateFilter',
    {
      description: `Update a saved search filter in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateFilter,
    },
    async ({ filterId, name, jql, description, favourite }) => {
      const result = await service.updateFilter(filterId, name, jql, description, favourite);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteFilter',
    {
      description: `Delete a saved search filter from the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteFilter,
    },
    async ({ filterId }) => {
      const result = await service.deleteFilter(filterId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getFavouriteFilters',
    {
      description: `Get the current user's favourite saved search filters in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getFavouriteFilters,
    },
    async () => {
      const result = await service.getFavouriteFilters();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getDashboards',
    {
      description: `Get a list of dashboards visible to the current user in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getDashboards,
    },
    async ({ filter, maxResults, startAt }) => {
      const result = await service.getDashboards(filter, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getDashboard',
    {
      description: `Get a single dashboard by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getDashboard,
    },
    async ({ dashboardId }) => {
      const result = await service.getDashboard(dashboardId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueTypeSchemes',
    {
      description: `Get all issue type schemes visible to the user in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueTypeSchemes,
    },
    async () => {
      const result = await service.getIssueTypeSchemes();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createIssueTypeScheme',
    {
      description: `Create a new issue type scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIssueTypeScheme,
    },
    async ({ name, description, issueTypeIds, defaultIssueTypeId }) => {
      const result = await service.createIssueTypeScheme(name, description, issueTypeIds, defaultIssueTypeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueTypeScheme',
    {
      description: `Get a single issue type scheme by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueTypeScheme,
    },
    async ({ schemeId }) => {
      const result = await service.getIssueTypeScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateIssueTypeScheme',
    {
      description: `Update an issue type scheme's name, description, or issue types in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssueTypeScheme,
    },
    async ({ schemeId, name, description, issueTypeIds, defaultIssueTypeId }) => {
      const result = await service.updateIssueTypeScheme(schemeId, name, description, issueTypeIds, defaultIssueTypeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteIssueTypeScheme',
    {
      description: `Delete an issue type scheme in the ${jiraInstanceType}. Associated projects fall back to the default scheme.`,
      inputSchema: jiraToolSchemas.deleteIssueTypeScheme,
    },
    async ({ schemeId }) => {
      const result = await service.deleteIssueTypeScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueTypeSchemeProjects',
    {
      description: `Get the projects associated with an issue type scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueTypeSchemeProjects,
    },
    async ({ schemeId, expand }) => {
      const result = await service.getIssueTypeSchemeProjects(schemeId, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_setIssueTypeSchemeProjects',
    {
      description: `Replace the project associations of an issue type scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setIssueTypeSchemeProjects,
    },
    async ({ schemeId, idsOrKeys }) => {
      const result = await service.setIssueTypeSchemeProjects(schemeId, idsOrKeys);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_addIssueTypeSchemeProjects',
    {
      description: `Add project associations to an issue type scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addIssueTypeSchemeProjects,
    },
    async ({ schemeId, idsOrKeys }) => {
      const result = await service.addIssueTypeSchemeProjects(schemeId, idsOrKeys);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_removeIssueTypeSchemeProjects',
    {
      description: `Remove all project associations from an issue type scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeIssueTypeSchemeProjects,
    },
    async ({ schemeId }) => {
      const result = await service.removeIssueTypeSchemeProjects(schemeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_removeIssueTypeSchemeProject',
    {
      description: `Remove a single project association from an issue type scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeIssueTypeSchemeProject,
    },
    async ({ schemeId, projIdOrKey }) => {
      const result = await service.removeIssueTypeSchemeProject(schemeId, projIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getPrioritySchemes',
    {
      description: `Get all priority schemes in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPrioritySchemes,
    },
    async ({ maxResults, startAt }) => {
      const result = await service.getPrioritySchemes(maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createPriorityScheme',
    {
      description: `Create a new priority scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createPriorityScheme,
    },
    async ({ name, description, defaultOptionId, optionIds }) => {
      const result = await service.createPriorityScheme(name, description, defaultOptionId, optionIds);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getPriorityScheme',
    {
      description: `Get a single priority scheme by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPriorityScheme,
    },
    async ({ schemeId }) => {
      const result = await service.getPriorityScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updatePriorityScheme',
    {
      description: `Update a priority scheme's name, description, or priorities in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updatePriorityScheme,
    },
    async ({ schemeId, name, description, defaultOptionId, optionIds }) => {
      const result = await service.updatePriorityScheme(schemeId, name, description, defaultOptionId, optionIds);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deletePriorityScheme',
    {
      description: `Delete a priority scheme in the ${jiraInstanceType}. Projects using it fall back to the default priority scheme.`,
      inputSchema: jiraToolSchemas.deletePriorityScheme,
    },
    async ({ schemeId }) => {
      const result = await service.deletePriorityScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getPermissionSchemes',
    {
      description: `Get all permission schemes in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPermissionSchemes,
    },
    async ({ expand }) => {
      const result = await service.getPermissionSchemes(expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getPermissionScheme',
    {
      description: `Get a single permission scheme by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPermissionScheme,
    },
    async ({ schemeId, expand }) => {
      const result = await service.getPermissionScheme(schemeId, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createPermissionScheme',
    {
      description: `Create a new permission scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createPermissionScheme,
    },
    async ({ name, description, permissions }) => {
      const result = await service.createPermissionScheme(name, description, permissions);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updatePermissionScheme',
    {
      description: `Update a permission scheme's name, description, or permission grants in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updatePermissionScheme,
    },
    async ({ schemeId, name, description, permissions }) => {
      const result = await service.updatePermissionScheme(schemeId, name, description, permissions);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deletePermissionScheme',
    {
      description: `Delete a permission scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deletePermissionScheme,
    },
    async ({ schemeId }) => {
      const result = await service.deletePermissionScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getPermissionSchemeGrants',
    {
      description: `Get all permission grants of a permission scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPermissionSchemeGrants,
    },
    async ({ schemeId, expand }) => {
      const result = await service.getPermissionSchemeGrants(schemeId, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createPermissionGrant',
    {
      description: `Create a permission grant in a permission scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createPermissionGrant,
    },
    async ({ schemeId, permission, holderType, holderParameter }) => {
      const result = await service.createPermissionGrant(schemeId, permission, holderType, holderParameter);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deletePermissionGrant',
    {
      description: `Delete a permission grant from a permission scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deletePermissionGrant,
    },
    async ({ schemeId, permissionId }) => {
      const result = await service.deletePermissionGrant(schemeId, permissionId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getApplicationRoles',
    {
      description: `Get all application roles (e.g. jira-software, jira-servicedesk) in the ${jiraInstanceType}. Read-only catalog of licensed applications.`,
      inputSchema: jiraToolSchemas.getApplicationRoles,
    },
    async () => {
      const result = await service.getApplicationRoles();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getApplicationRole',
    {
      description: `Get a single application role by key from the ${jiraInstanceType}. Use jira_getApplicationRoles to find valid keys.`,
      inputSchema: jiraToolSchemas.getApplicationRole,
    },
    async ({ key }) => {
      const result = await service.getApplicationRole(key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getNotificationSchemes',
    {
      description: `Get a paginated list of notification schemes in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getNotificationSchemes,
    },
    async ({ expand, maxResults, startAt }) => {
      const result = await service.getNotificationSchemes(expand, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getNotificationScheme',
    {
      description: `Get full details of a notification scheme by id in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getNotificationScheme,
    },
    async ({ id, expand }) => {
      const result = await service.getNotificationScheme(id, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getSecurityLevel',
    {
      description: `Get an issue security level by id in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getSecurityLevel,
    },
    async ({ id }) => {
      const result = await service.getSecurityLevel(id);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueSecuritySchemes',
    {
      description: `Get all issue security schemes in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueSecuritySchemes,
    },
    async () => {
      const result = await service.getIssueSecuritySchemes();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueSecurityScheme',
    {
      description: `Get an issue security scheme by id in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueSecurityScheme,
    },
    async ({ id }) => {
      const result = await service.getIssueSecurityScheme(id);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCustomFields',
    {
      description: `Get a paginated, filterable list of custom fields in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCustomFields,
    },
    async ({ sortColumn, types, search, maxResults, sortOrder, screenIds, lastValueUpdate, projectIds, startAt }) => {
      const result = await service.getCustomFields(sortColumn, types, search, maxResults, sortOrder, screenIds, lastValueUpdate, projectIds, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteCustomFields',
    {
      description: `Delete custom fields in bulk in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteCustomFields,
    },
    async ({ ids }) => {
      const result = await service.deleteCustomFields(ids);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCustomFieldOptions',
    {
      description: `Get a custom field's options defined in a given context of projects and issue types in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCustomFieldOptions,
    },
    async ({ customFieldId, maxResults, issueTypeIds, query, sortByOptionName, useAllContexts, page, projectIds }) => {
      const result = await service.getCustomFieldOptions(customFieldId, maxResults, issueTypeIds, query, sortByOptionName, useAllContexts, page, projectIds);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCustomFieldOption',
    {
      description: `Get a custom field option by id in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCustomFieldOption,
    },
    async ({ id }) => {
      const result = await service.getCustomFieldOption(id);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createCustomField',
    {
      description: `Create a new custom field in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createCustomField,
    },
    async ({ name, type, description, searcherKey, issueTypeIds, projectIds }) => {
      const result = await service.createCustomField(name, type, description, searcherKey, issueTypeIds, projectIds);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getJqlAutocompleteData',
    {
      description: `Get the reserved words, visible field names, and function names available for building JQL queries in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getJqlAutocompleteData,
    },
    async () => {
      const result = await service.getJqlAutocompleteData();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getJqlFieldAutocomplete',
    {
      description: `Get value autocomplete suggestions for a JQL field while building a query in the ${jiraInstanceType}. Useful before calling jira_searchIssues to discover valid field values.`,
      inputSchema: jiraToolSchemas.getJqlFieldAutocomplete,
    },
    async ({ fieldName, fieldValue, predicateName, predicateValue }) => {
      const result = await service.getJqlFieldAutocomplete(fieldName, fieldValue, predicateName, predicateValue);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_validateProjectKey',
    {
      description: `Validate a candidate project key in the ${jiraInstanceType} before creating a new project. Returns any validation errors; an empty result means the key is valid.`,
      inputSchema: jiraToolSchemas.validateProjectKey,
    },
    async ({ key }) => {
      const result = await service.validateProjectKey(key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getServerInfo',
    {
      description: `Get general information about the current ${jiraInstanceType} server, including version, build number, and deployment type`,
      inputSchema: jiraToolSchemas.getServerInfo,
    },
    async () => {
      const result = await service.getServerInfo();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_validateLicense',
    {
      description: `Validate a license string against the current ${jiraInstanceType} server installation`,
      inputSchema: jiraToolSchemas.validateLicense,
    },
    async ({ licenseString }) => {
      const result = await service.validateLicense(licenseString);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getApplicationProperty',
    {
      description: `Get an application property by key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getApplicationProperty,
    },
    async ({ permissionLevel, key, keyFilter }) => {
      const result = await service.getApplicationProperty(permissionLevel, key, keyFilter);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getAdvancedSettings',
    {
      description: `Get all advanced settings application properties (General Configuration > Advanced Settings) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getAdvancedSettings,
    },
    async () => {
      const result = await service.getAdvancedSettings();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_setApplicationProperty',
    {
      description: `Update an application property's value in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setApplicationProperty,
    },
    async ({ id, value }) => {
      const result = await service.setApplicationProperty(id, value);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getClusterNodes',
    {
      description: `Get all nodes in the cluster in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getClusterNodes,
    },
    async () => {
      const result = await service.getClusterNodes();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteClusterNode',
    {
      description: `Delete an OFFLINE node from the cluster in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteClusterNode,
    },
    async ({ nodeId }) => {
      const result = await service.deleteClusterNode(nodeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_setClusterNodeOffline',
    {
      description: `Change a cluster node's state to OFFLINE in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setClusterNodeOffline,
    },
    async ({ nodeId }) => {
      const result = await service.setClusterNodeOffline(nodeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_requestClusterNodeIndexSnapshot',
    {
      description: `Request an index snapshot from a cluster node in the ${jiraInstanceType} (deprecated, Lucene-specific, planned for removal in Jira 11)`,
      inputSchema: jiraToolSchemas.requestClusterNodeIndexSnapshot,
    },
    async ({ nodeId }) => {
      const result = await service.requestClusterNodeIndexSnapshot(nodeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_approveClusterUpgrade',
    {
      description: `Approve an ongoing zero-downtime cluster upgrade in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.approveClusterUpgrade,
    },
    async () => {
      const result = await service.approveClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_cancelClusterUpgrade',
    {
      description: `Cancel an ongoing zero-downtime cluster upgrade in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.cancelClusterUpgrade,
    },
    async () => {
      const result = await service.cancelClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_retryClusterUpgrade',
    {
      description: `Retry a failed zero-downtime cluster upgrade in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.retryClusterUpgrade,
    },
    async () => {
      const result = await service.retryClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_startClusterUpgrade',
    {
      description: `Start a zero-downtime cluster upgrade in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.startClusterUpgrade,
    },
    async () => {
      const result = await service.startClusterUpgrade();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getClusterUpgradeState',
    {
      description: `Get the current state of the zero-downtime cluster upgrade in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getClusterUpgradeState,
    },
    async () => {
      const result = await service.getClusterUpgradeState();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIndexSummary',
    {
      description: `Get a summary of the issue index condition of the current node in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIndexSummary,
    },
    async () => {
      const result = await service.getIndexSummary();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_listIndexSnapshots',
    {
      description: `List available index snapshots (absolute paths with timestamps) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.listIndexSnapshots,
    },
    async () => {
      const result = await service.listIndexSnapshots();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createIndexSnapshot',
    {
      description: `Start creating an index snapshot, if none is already in progress, in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIndexSnapshot,
    },
    async () => {
      const result = await service.createIndexSnapshot();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIndexSnapshotStatus',
    {
      description: `Check whether index snapshot creation is currently running in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIndexSnapshotStatus,
    },
    async () => {
      const result = await service.getIndexSnapshotStatus();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getReindexInfo',
    {
      description: `Get information on the active or most recent system reindex in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getReindexInfo,
    },
    async ({ taskId }) => {
      const result = await service.getReindexInfo(taskId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_startReindex',
    {
      description: `Kick off a full system reindex in the ${jiraInstanceType}. Requires admin permissions.`,
      inputSchema: jiraToolSchemas.startReindex,
    },
    async ({ indexChangeHistory, type, indexWorklogs, indexComments }) => {
      const result = await service.startReindex(indexChangeHistory, type, indexWorklogs, indexComments);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_reindexIssues',
    {
      description: `Synchronously reindex one or more individual issues in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.reindexIssues,
    },
    async ({ issueIds, indexChangeHistory, indexWorklogs, indexComments }) => {
      const result = await service.reindexIssues(issueIds, indexChangeHistory, indexWorklogs, indexComments);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getReindexProgress',
    {
      description: `Get progress information on the active or most recent system reindex in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getReindexProgress,
    },
    async ({ taskId }) => {
      const result = await service.getReindexProgress(taskId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_processReindexRequests',
    {
      description: `Execute any pending reindex requests in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.processReindexRequests,
    },
    async () => {
      const result = await service.processReindexRequests();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getReindexRequestsProgress',
    {
      description: `Get the progress of multiple reindex requests in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getReindexRequestsProgress,
    },
    async ({ requestIds }) => {
      const result = await service.getReindexRequestsProgress(requestIds);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getReindexRequestProgress',
    {
      description: `Get the progress of a single reindex request in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getReindexRequestProgress,
    },
    async ({ requestId }) => {
      const result = await service.getReindexRequestProgress(requestId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_downloadEmailTemplates',
    {
      description: `Download the current email templates as a base64-encoded zip file from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.downloadEmailTemplates,
    },
    async () => {
      const result = await service.downloadEmailTemplates();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_uploadEmailTemplates',
    {
      description: `Upload a base64-encoded zip file of email templates to a temporary folder in the ${jiraInstanceType}. Call jira_applyEmailTemplates to make it active.`,
      inputSchema: jiraToolSchemas.uploadEmailTemplates,
    },
    async ({ contentBase64 }) => {
      const result = await service.uploadEmailTemplates(contentBase64);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_applyEmailTemplates',
    {
      description: `Replace the current email templates with the previously uploaded pack in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.applyEmailTemplates,
    },
    async () => {
      const result = await service.applyEmailTemplates();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_resetEmailTemplatesToDefault',
    {
      description: `Replace the current email templates with the default templates shipped with the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.resetEmailTemplatesToDefault,
    },
    async () => {
      const result = await service.resetEmailTemplatesToDefault();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getEmailTemplateTypes',
    {
      description: `Get the list of root email templates mapped to event types in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getEmailTemplateTypes,
    },
    async () => {
      const result = await service.getEmailTemplateTypes();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCurrentSession',
    {
      description: `Get information about the currently authenticated user's session in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCurrentSession,
    },
    async () => {
      const result = await service.getCurrentSession();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createSession',
    {
      description: `Create a new authenticated session in the ${jiraInstanceType} using a username and password`,
      inputSchema: jiraToolSchemas.createSession,
    },
    async ({ username, password }) => {
      const result = await service.createSession(username, password);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteSession',
    {
      description: `Log out the current user, destroying their session, in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteSession,
    },
    async () => {
      const result = await service.deleteSession();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_releaseWebSudo',
    {
      description: `Invalidate the current WebSudo (elevated permission) session in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.releaseWebSudo,
    },
    async () => {
      const result = await service.releaseWebSudo();

      return formatToolResponse(result);
    },
  );
}
