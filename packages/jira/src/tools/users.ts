import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerUserTools(server: McpServer, service: JiraService) {
  server.registerTool(
    'jira_getUser',
    {
      description: `Get details of a single user by username or key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getUser,
    },
    async ({ username, key, includeDeleted }) => {
      const result = await service.getUser(username, key, includeDeleted);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_findUsers',
    {
      description: `Search for users by free-text query in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.findUsers,
    },
    async ({ username, maxResults, startAt, includeActive, includeInactive }) => {
      const result = await service.findUsers(username, maxResults, startAt, includeActive, includeInactive);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_findAssignableUsers',
    {
      description: `Search for users assignable to a project or issue in the ${jiraInstanceType}. Use before jira_assignIssue to find valid candidates.`,
      inputSchema: jiraToolSchemas.findAssignableUsers,
    },
    async ({ project, issueKey, username, maxResults }) => {
      const result = await service.findAssignableUsers(project, issueKey, username, maxResults);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createGroup',
    {
      description: `Create a group in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createGroup,
    },
    async ({ name }) => {
      const result = await service.createGroup(name);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteGroup',
    {
      description: `Delete a group from the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteGroup,
    },
    async ({ groupname, swapGroup }) => {
      const result = await service.deleteGroup(groupname, swapGroup);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getGroupUsers',
    {
      description: `Get the members of a group in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getGroupUsers,
    },
    async ({ groupname, includeInactiveUsers, maxResults, startAt }) => {
      const result = await service.getGroupUsers(groupname, includeInactiveUsers, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_addUserToGroup',
    {
      description: `Add a user to a group in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addUserToGroup,
    },
    async ({ groupname, username }) => {
      const result = await service.addUserToGroup(groupname, username);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_removeUserFromGroup',
    {
      description: `Remove a user from a group in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeUserFromGroup,
    },
    async ({ groupname, username }) => {
      const result = await service.removeUserFromGroup(groupname, username);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_findGroups',
    {
      description: `Search for groups by a substring match against group names in the ${jiraInstanceType}. Used for group-picker style autocomplete.`,
      inputSchema: jiraToolSchemas.findGroups,
    },
    async ({ query, maxResults, exclude, userName }) => {
      const result = await service.findGroups(query, maxResults, exclude, userName);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_findUsersAndGroups',
    {
      description: `Search for users and groups matching a query, with match highlighting, in the ${jiraInstanceType}. Used for combined user/group-picker style autocomplete fields such as assignee, reporter, or a group-picker custom field.`,
      inputSchema: jiraToolSchemas.findUsersAndGroups,
    },
    async ({ query, maxResults, showAvatar, issueTypeId, projectId, fieldId }) => {
      const result = await service.findUsersAndGroups(query, maxResults, showAvatar, issueTypeId, projectId, fieldId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createUser',
    {
      description: `Create a new user in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createUser,
    },
    async ({ name, emailAddress, displayName, password, notification }) => {
      const result = await service.createUser(name, emailAddress, displayName, password, notification);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_removeUser',
    {
      description: `Remove a user and its references in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeUser,
    },
    async ({ key, username }) => {
      const result = await service.removeUser(key, username);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_changeUserPassword',
    {
      description: `Change a user's password in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.changeUserPassword,
    },
    async ({ password, currentPassword, key, username }) => {
      const result = await service.changeUserPassword(password, currentPassword, key, username);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_validateUserAnonymization',
    {
      description: `Validate whether a user can be anonymized in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.validateUserAnonymization,
    },
    async ({ userKey, expand }) => {
      const result = await service.validateUserAnonymization(userKey, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_scheduleUserAnonymization',
    {
      description: `Schedule a user anonymization process in the ${jiraInstanceType}. Requires system admin permission.`,
      inputSchema: jiraToolSchemas.scheduleUserAnonymization,
    },
    async ({ userKey, newOwnerKey }) => {
      const result = await service.scheduleUserAnonymization(userKey, newOwnerKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getUserAnonymizationProgress',
    {
      description: `Get the progress of a user anonymization task in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getUserAnonymizationProgress,
    },
    async ({ taskId }) => {
      const result = await service.getUserAnonymizationProgress(taskId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getSystemAvatars',
    {
      description: `Get all system avatars of a given type in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getSystemAvatars,
    },
    async ({ type }) => {
      const result = await service.getSystemAvatars(type);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getAvatars',
    {
      description: `Get all avatars (system and custom) for a given type and owner in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getAvatars,
    },
    async ({ type, owningObjectId }) => {
      const result = await service.getAvatars(type, owningObjectId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_uploadTemporaryAvatar',
    {
      description: `Upload a temporary avatar image in the ${jiraInstanceType}. Returns cropping instructions to pass to jira_createAvatarFromTemporary.`,
      inputSchema: jiraToolSchemas.uploadTemporaryAvatar,
    },
    async ({ type, owningObjectId, fileName, contentBase64 }) => {
      const result = await service.uploadTemporaryAvatar(type, owningObjectId, fileName, contentBase64);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createAvatarFromTemporary',
    {
      description: `Finalize a temporary avatar into a real avatar in the ${jiraInstanceType}, using the cropping instructions from jira_uploadTemporaryAvatar.`,
      inputSchema: jiraToolSchemas.createAvatarFromTemporary,
    },
    async ({ type, owningObjectId, cropperOffsetX, cropperOffsetY, cropperWidth, needsCropping, url }) => {
      const result = await service.createAvatarFromTemporary(type, owningObjectId, cropperOffsetX, cropperOffsetY, cropperWidth, needsCropping, url);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteAvatar',
    {
      description: `Delete an avatar by id in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteAvatar,
    },
    async ({ id, type, owningObjectId }) => {
      const result = await service.deleteAvatar(id, type, owningObjectId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getMyPermissions',
    {
      description: `Get the permissions the currently logged in user has in the ${jiraInstanceType}, optionally scoped to a project or issue`,
      inputSchema: jiraToolSchemas.getMyPermissions,
    },
    async ({ projectKey, projectId, issueKey, issueId }) => {
      const result = await service.getMyPermissions(projectKey, projectId, issueKey, issueId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getAllPermissions',
    {
      description: `Get the full catalog of permission types present in the ${jiraInstanceType} — global, project, and plugin-added`,
      inputSchema: jiraToolSchemas.getAllPermissions,
    },
    async () => {
      const result = await service.getAllPermissions();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getMyPreference',
    {
      description: `Get a preference value for the current user by key in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getMyPreference,
    },
    async ({ key }) => {
      const result = await service.getMyPreference(key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_setMyPreference',
    {
      description: `Set a preference value for the current user by key in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setMyPreference,
    },
    async ({ key, value }) => {
      const result = await service.setMyPreference(key, value);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteMyPreference',
    {
      description: `Remove a preference value for the current user by key in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteMyPreference,
    },
    async ({ key }) => {
      const result = await service.deleteMyPreference(key);

      return formatToolResponse(result);
    },
  );
}
