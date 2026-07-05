import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerUserTools(server: McpServer, service: ConfluenceService) {
  server.tool(
    'confluence_getCurrentUser',
    `Get information about the current logged in user in ${confluenceInstanceType}`,
    confluenceToolSchemas.getCurrentUser,
    async ({ expand }) => {
      const result = await service.getCurrentUser(expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getAnonymousUser',
    `Get information about how the anonymous user is represented in ${confluenceInstanceType}`,
    confluenceToolSchemas.getAnonymousUser,
    async ({ expand }) => {
      const result = await service.getAnonymousUser(expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getUser',
    `Get a user by user key or username in ${confluenceInstanceType}`,
    confluenceToolSchemas.getUser,
    async ({ key, username, expand }) => {
      const result = await service.getUser(key, username, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getUsers',
    `Get a paginated collection of all registered users in ${confluenceInstanceType}`,
    confluenceToolSchemas.getUsers,
    async ({ limit, start, expand }) => {
      const result = await service.getUsers(limit, start, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getUserGroups',
    `Get the groups a user is a member of in ${confluenceInstanceType}`,
    confluenceToolSchemas.getUserGroups,
    async ({ key, username, limit, start, expand }) => {
      const result = await service.getUserGroups(key, username, limit, start, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_updateCurrentUser',
    `Update the current user's full name and/or email in ${confluenceInstanceType}`,
    confluenceToolSchemas.updateCurrentUser,
    async ({ fullName, email, currentPassword }) => {
      const result = await service.updateCurrentUser(fullName, email, currentPassword);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_changeCurrentUserPassword',
    `Change the password for the current user in ${confluenceInstanceType}`,
    confluenceToolSchemas.changeCurrentUserPassword,
    async ({ newPassword, oldPassword }) => {
      const result = await service.changeCurrentUserPassword(newPassword, oldPassword);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getGroup',
    `Get a user group by name in ${confluenceInstanceType}`,
    confluenceToolSchemas.getGroup,
    async ({ groupName, expand }) => {
      const result = await service.getGroup(groupName, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getGroups',
    `Get a paginated collection of all user groups in ${confluenceInstanceType}`,
    confluenceToolSchemas.getGroups,
    async ({ limit, start, expand }) => {
      const result = await service.getGroups(limit, start, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getGroupMembers',
    `Get the users that are members of a group in ${confluenceInstanceType}`,
    confluenceToolSchemas.getGroupMembers,
    async ({ groupName, limit, start, expand }) => {
      const result = await service.getGroupMembers(groupName, limit, start, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getNestedGroupMembers',
    `Get the groups nested directly within a group in ${confluenceInstanceType}`,
    confluenceToolSchemas.getNestedGroupMembers,
    async ({ groupName, limit, start, expand }) => {
      const result = await service.getNestedGroupMembers(groupName, limit, start, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_addUserToGroup',
    `Add a user to a group in ${confluenceInstanceType}. Idempotent.`,
    confluenceToolSchemas.addUserToGroup,
    async ({ username, groupName }) => {
      const result = await service.addUserToGroup(username, groupName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_removeUserFromGroup',
    `Remove a user from a group in ${confluenceInstanceType}. Idempotent.`,
    confluenceToolSchemas.removeUserFromGroup,
    async ({ username, groupName }) => {
      const result = await service.removeUserFromGroup(username, groupName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminCreateUser',
    `Create a new user in ${confluenceInstanceType}. Requires system administrator permission.`,
    confluenceToolSchemas.adminCreateUser,
    async ({ userName, fullName, email, password, notifyViaEmail }) => {
      const result = await service.adminCreateUser(userName, fullName, email, password, notifyViaEmail);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminUpdateUser',
    `Update a user's full name and/or email in ${confluenceInstanceType}. Requires system administrator permission.`,
    confluenceToolSchemas.adminUpdateUser,
    async ({ username, fullName, email }) => {
      const result = await service.adminUpdateUser(username, fullName, email);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminDeleteUser',
    `Delete a user in ${confluenceInstanceType}. Requires system administrator permission. Runs asynchronously.`,
    confluenceToolSchemas.adminDeleteUser,
    async ({ username }) => {
      const result = await service.adminDeleteUser(username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminDisableUser',
    `Disable a user in ${confluenceInstanceType}. Requires system administrator permission. Idempotent.`,
    confluenceToolSchemas.adminDisableUser,
    async ({ username }) => {
      const result = await service.adminDisableUser(username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminEnableUser',
    `Enable a user in ${confluenceInstanceType}. Requires system administrator permission. Idempotent.`,
    confluenceToolSchemas.adminEnableUser,
    async ({ username }) => {
      const result = await service.adminEnableUser(username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminChangeUserPassword',
    `Change another user's password in ${confluenceInstanceType}. Requires system administrator permission.`,
    confluenceToolSchemas.adminChangeUserPassword,
    async ({ username, password }) => {
      const result = await service.adminChangeUserPassword(username, password);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminCreateGroup',
    `Create a new user group in ${confluenceInstanceType}. Requires system administrator permission.`,
    confluenceToolSchemas.adminCreateGroup,
    async ({ name }) => {
      const result = await service.adminCreateGroup(name);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminDeleteGroup',
    `Delete a user group in ${confluenceInstanceType}. Requires system administrator permission.`,
    confluenceToolSchemas.adminDeleteGroup,
    async ({ groupName }) => {
      const result = await service.adminDeleteGroup(groupName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_adminGetActiveUsers',
    `Get a paginated collection of active (license-counting) users in ${confluenceInstanceType}`,
    confluenceToolSchemas.adminGetActiveUsers,
    async ({ limit, start, expand }) => {
      const result = await service.adminGetActiveUsers(limit, start, expand);

      return formatToolResponse(result);
    },
  );
}
