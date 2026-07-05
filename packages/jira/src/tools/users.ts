import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerUserTools(server: McpServer, service: JiraService) {
  server.tool(
    'jira_getUser',
    `Get details of a single user by username or key from the ${jiraInstanceType}`,
    jiraToolSchemas.getUser,
    async ({ username, key, includeDeleted }) => {
      const result = await service.getUser(username, key, includeDeleted);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_findUsers',
    `Search for users by free-text query in the ${jiraInstanceType}`,
    jiraToolSchemas.findUsers,
    async ({ username, maxResults, startAt, includeActive, includeInactive }) => {
      const result = await service.findUsers(username, maxResults, startAt, includeActive, includeInactive);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_findAssignableUsers',
    `Search for users assignable to a project or issue in the ${jiraInstanceType}. Use before jira_assignIssue to find valid candidates.`,
    jiraToolSchemas.findAssignableUsers,
    async ({ project, issueKey, username, maxResults }) => {
      const result = await service.findAssignableUsers(project, issueKey, username, maxResults);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createGroup',
    `Create a group in the ${jiraInstanceType}`,
    jiraToolSchemas.createGroup,
    async ({ name }) => {
      const result = await service.createGroup(name);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteGroup',
    `Delete a group from the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteGroup,
    async ({ groupname, swapGroup }) => {
      const result = await service.deleteGroup(groupname, swapGroup);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getGroupUsers',
    `Get the members of a group in the ${jiraInstanceType}`,
    jiraToolSchemas.getGroupUsers,
    async ({ groupname, includeInactiveUsers, maxResults, startAt }) => {
      const result = await service.getGroupUsers(groupname, includeInactiveUsers, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addUserToGroup',
    `Add a user to a group in the ${jiraInstanceType}`,
    jiraToolSchemas.addUserToGroup,
    async ({ groupname, username }) => {
      const result = await service.addUserToGroup(groupname, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_removeUserFromGroup',
    `Remove a user from a group in the ${jiraInstanceType}`,
    jiraToolSchemas.removeUserFromGroup,
    async ({ groupname, username }) => {
      const result = await service.removeUserFromGroup(groupname, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_findGroups',
    `Search for groups by a substring match against group names in the ${jiraInstanceType}. Used for group-picker style autocomplete.`,
    jiraToolSchemas.findGroups,
    async ({ query, maxResults, exclude, userName }) => {
      const result = await service.findGroups(query, maxResults, exclude, userName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_findUsersAndGroups',
    `Search for users and groups matching a query, with match highlighting, in the ${jiraInstanceType}. Used for combined user/group-picker style autocomplete fields such as assignee, reporter, or a group-picker custom field.`,
    jiraToolSchemas.findUsersAndGroups,
    async ({ query, maxResults, showAvatar, issueTypeId, projectId, fieldId }) => {
      const result = await service.findUsersAndGroups(query, maxResults, showAvatar, issueTypeId, projectId, fieldId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createUser',
    `Create a new user in the ${jiraInstanceType}`,
    jiraToolSchemas.createUser,
    async ({ name, emailAddress, displayName, password, notification }) => {
      const result = await service.createUser(name, emailAddress, displayName, password, notification);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_removeUser',
    `Remove a user and its references in the ${jiraInstanceType}`,
    jiraToolSchemas.removeUser,
    async ({ key, username }) => {
      const result = await service.removeUser(key, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_changeUserPassword',
    `Change a user's password in the ${jiraInstanceType}`,
    jiraToolSchemas.changeUserPassword,
    async ({ password, currentPassword, key, username }) => {
      const result = await service.changeUserPassword(password, currentPassword, key, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_validateUserAnonymization',
    `Validate whether a user can be anonymized in the ${jiraInstanceType}`,
    jiraToolSchemas.validateUserAnonymization,
    async ({ userKey, expand }) => {
      const result = await service.validateUserAnonymization(userKey, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_scheduleUserAnonymization',
    `Schedule a user anonymization process in the ${jiraInstanceType}. Requires system admin permission.`,
    jiraToolSchemas.scheduleUserAnonymization,
    async ({ userKey, newOwnerKey }) => {
      const result = await service.scheduleUserAnonymization(userKey, newOwnerKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getUserAnonymizationProgress',
    `Get the progress of a user anonymization task in the ${jiraInstanceType}`,
    jiraToolSchemas.getUserAnonymizationProgress,
    async ({ taskId }) => {
      const result = await service.getUserAnonymizationProgress(taskId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getSystemAvatars',
    `Get all system avatars of a given type in the ${jiraInstanceType}`,
    jiraToolSchemas.getSystemAvatars,
    async ({ type }) => {
      const result = await service.getSystemAvatars(type);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getAvatars',
    `Get all avatars (system and custom) for a given type and owner in the ${jiraInstanceType}`,
    jiraToolSchemas.getAvatars,
    async ({ type, owningObjectId }) => {
      const result = await service.getAvatars(type, owningObjectId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_uploadTemporaryAvatar',
    `Upload a temporary avatar image in the ${jiraInstanceType}. Returns cropping instructions to pass to jira_createAvatarFromTemporary.`,
    jiraToolSchemas.uploadTemporaryAvatar,
    async ({ type, owningObjectId, fileName, contentBase64 }) => {
      const result = await service.uploadTemporaryAvatar(type, owningObjectId, fileName, contentBase64);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createAvatarFromTemporary',
    `Finalize a temporary avatar into a real avatar in the ${jiraInstanceType}, using the cropping instructions from jira_uploadTemporaryAvatar.`,
    jiraToolSchemas.createAvatarFromTemporary,
    async ({ type, owningObjectId, cropperOffsetX, cropperOffsetY, cropperWidth, needsCropping, url }) => {
      const result = await service.createAvatarFromTemporary(type, owningObjectId, cropperOffsetX, cropperOffsetY, cropperWidth, needsCropping, url);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteAvatar',
    `Delete an avatar by id in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteAvatar,
    async ({ id, type, owningObjectId }) => {
      const result = await service.deleteAvatar(id, type, owningObjectId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getMyPermissions',
    `Get the permissions the currently logged in user has in the ${jiraInstanceType}, optionally scoped to a project or issue`,
    jiraToolSchemas.getMyPermissions,
    async ({ projectKey, projectId, issueKey, issueId }) => {
      const result = await service.getMyPermissions(projectKey, projectId, issueKey, issueId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getAllPermissions',
    `Get the full catalog of permission types present in the ${jiraInstanceType} — global, project, and plugin-added`,
    jiraToolSchemas.getAllPermissions,
    async () => {
      const result = await service.getAllPermissions();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getMyPreference',
    `Get a preference value for the current user by key in the ${jiraInstanceType}`,
    jiraToolSchemas.getMyPreference,
    async ({ key }) => {
      const result = await service.getMyPreference(key);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setMyPreference',
    `Set a preference value for the current user by key in the ${jiraInstanceType}`,
    jiraToolSchemas.setMyPreference,
    async ({ key, value }) => {
      const result = await service.setMyPreference(key, value);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteMyPreference',
    `Remove a preference value for the current user by key in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteMyPreference,
    async ({ key }) => {
      const result = await service.deleteMyPreference(key);

      return formatToolResponse(result);
    },
  );
}
