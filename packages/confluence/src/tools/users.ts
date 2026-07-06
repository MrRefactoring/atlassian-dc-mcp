import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse, registerAnnotatedTool } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerUserTools(server: McpServer, service: ConfluenceService) {
  registerAnnotatedTool(server,
    'confluence_get_current_user',
    {
      description: `Get information about the current logged in user in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getCurrentUser,
    },
    async ({ expand }) => {
      const result = await service.getCurrentUser(expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_anonymous_user',
    {
      description: `Get information about how the anonymous user is represented in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getAnonymousUser,
    },
    async ({ expand }) => {
      const result = await service.getAnonymousUser(expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_user',
    {
      description: `Get a user by user key or username in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getUser,
    },
    async ({ key, username, expand }) => {
      const result = await service.getUser(key, username, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_users',
    {
      description: `Get a paginated collection of all registered users in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getUsers,
    },
    async ({ limit, start, expand }) => {
      const result = await service.getUsers(limit, start, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_user_groups',
    {
      description: `Get the groups a user is a member of in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getUserGroups,
    },
    async ({ key, username, limit, start, expand }) => {
      const result = await service.getUserGroups(key, username, limit, start, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_update_current_user',
    {
      description: `Update the current user's full name and/or email in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.updateCurrentUser,
    },
    async ({ fullName, email, currentPassword }) => {
      const result = await service.updateCurrentUser(fullName, email, currentPassword);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_change_current_user_password',
    {
      description: `Change the password for the current user in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.changeCurrentUserPassword,
    },
    async ({ newPassword, oldPassword }) => {
      const result = await service.changeCurrentUserPassword(newPassword, oldPassword);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_group',
    {
      description: `Get a user group by name in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getGroup,
    },
    async ({ groupName, expand }) => {
      const result = await service.getGroup(groupName, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_groups',
    {
      description: `Get a paginated collection of all user groups in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getGroups,
    },
    async ({ limit, start, expand, fetchAll }) => {
      const result = await service.getGroups(limit, start, expand, fetchAll);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_group_members',
    {
      description: `Get the users that are members of a group in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getGroupMembers,
    },
    async ({ groupName, limit, start, expand }) => {
      const result = await service.getGroupMembers(groupName, limit, start, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_nested_group_members',
    {
      description: `Get the groups nested directly within a group in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getNestedGroupMembers,
    },
    async ({ groupName, limit, start, expand }) => {
      const result = await service.getNestedGroupMembers(groupName, limit, start, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_add_user_to_group',
    {
      description: `Add a user to a group in ${confluenceInstanceType}. Idempotent.`,
      inputSchema: confluenceToolSchemas.addUserToGroup,
    },
    async ({ username, groupName }) => {
      const result = await service.addUserToGroup(username, groupName);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_remove_user_from_group',
    {
      description: `Remove a user from a group in ${confluenceInstanceType}. Idempotent.`,
      inputSchema: confluenceToolSchemas.removeUserFromGroup,
    },
    async ({ username, groupName }) => {
      const result = await service.removeUserFromGroup(username, groupName);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_create_user',
    {
      description: `Create a new user in ${confluenceInstanceType}. Requires system administrator permission.`,
      inputSchema: confluenceToolSchemas.adminCreateUser,
    },
    async ({ userName, fullName, email, password, notifyViaEmail }) => {
      const result = await service.adminCreateUser(userName, fullName, email, password, notifyViaEmail);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_update_user',
    {
      description: `Update a user's full name and/or email in ${confluenceInstanceType}. Requires system administrator permission.`,
      inputSchema: confluenceToolSchemas.adminUpdateUser,
    },
    async ({ username, fullName, email }) => {
      const result = await service.adminUpdateUser(username, fullName, email);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_delete_user',
    {
      description: `Delete a user in ${confluenceInstanceType}. Requires system administrator permission. Runs asynchronously.`,
      inputSchema: confluenceToolSchemas.adminDeleteUser,
    },
    async ({ username }) => {
      const result = await service.adminDeleteUser(username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_disable_user',
    {
      description: `Disable a user in ${confluenceInstanceType}. Requires system administrator permission. Idempotent.`,
      inputSchema: confluenceToolSchemas.adminDisableUser,
    },
    async ({ username }) => {
      const result = await service.adminDisableUser(username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_enable_user',
    {
      description: `Enable a user in ${confluenceInstanceType}. Requires system administrator permission. Idempotent.`,
      inputSchema: confluenceToolSchemas.adminEnableUser,
    },
    async ({ username }) => {
      const result = await service.adminEnableUser(username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_change_user_password',
    {
      description: `Change another user's password in ${confluenceInstanceType}. Requires system administrator permission.`,
      inputSchema: confluenceToolSchemas.adminChangeUserPassword,
    },
    async ({ username, password }) => {
      const result = await service.adminChangeUserPassword(username, password);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_create_group',
    {
      description: `Create a new user group in ${confluenceInstanceType}. Requires system administrator permission.`,
      inputSchema: confluenceToolSchemas.adminCreateGroup,
    },
    async ({ name }) => {
      const result = await service.adminCreateGroup(name);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_delete_group',
    {
      description: `Delete a user group in ${confluenceInstanceType}. Requires system administrator permission.`,
      inputSchema: confluenceToolSchemas.adminDeleteGroup,
    },
    async ({ groupName }) => {
      const result = await service.adminDeleteGroup(groupName);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_admin_get_active_users',
    {
      description: `Get a paginated collection of active (license-counting) users in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.adminGetActiveUsers,
    },
    async ({ limit, start, expand }) => {
      const result = await service.adminGetActiveUsers(limit, start, expand);

      return formatToolResponse(result);
    },
  );
}
