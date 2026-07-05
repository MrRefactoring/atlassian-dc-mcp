import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerPermissionTools(server: McpServer, service: BitbucketService) {
  server.registerTool(
    'bitbucket_get_project_permissions',
    {
      description: 'Get the users and groups granted a permission on a Bitbucket project, along with their highest permission level. Requires PROJECT_ADMIN permission (or higher) for the project.',
      inputSchema: bitbucketToolSchemas.getProjectPermissions,
    },
    async ({ projectKey, filter, start, limit }) => {
      const result = await service.getProjectPermissions(projectKey, filter, start, limit);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_set_project_user_permission',
    {
      description: 'Grant or change a user\'s permission level on a Bitbucket project (PROJECT_READ, PROJECT_WRITE, or PROJECT_ADMIN). Requires PROJECT_ADMIN permission (or higher) for the project.',
      inputSchema: bitbucketToolSchemas.setProjectUserPermission,
    },
    async ({ projectKey, name, permission }) => {
      const result = await service.setProjectUserPermission(projectKey, name, permission);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_set_project_group_permission',
    {
      description: 'Grant or change a group\'s permission level on a Bitbucket project (PROJECT_READ, PROJECT_WRITE, or PROJECT_ADMIN). Requires PROJECT_ADMIN permission (or higher) for the project.',
      inputSchema: bitbucketToolSchemas.setProjectGroupPermission,
    },
    async ({ projectKey, name, permission }) => {
      const result = await service.setProjectGroupPermission(projectKey, name, permission);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_revoke_project_permission',
    {
      description: 'Revoke a user\'s and/or a group\'s permissions on a Bitbucket project. Provide at least one of user or group. Requires PROJECT_ADMIN permission (or higher) for the project.',
      inputSchema: bitbucketToolSchemas.revokeProjectPermission,
    },
    async ({ projectKey, user, group }) => {
      const result = await service.revokeProjectPermission(projectKey, user, group);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_get_repo_permissions',
    {
      description: 'Get the users and groups granted a permission on a Bitbucket repository, along with their highest permission level. Requires REPO_ADMIN permission (or higher project/global permission).',
      inputSchema: bitbucketToolSchemas.getRepoPermissions,
    },
    async ({ projectKey, repositorySlug, filter, start, limit }) => {
      const result = await service.getRepoPermissions(projectKey, repositorySlug, filter, start, limit);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_set_repo_user_permission',
    {
      description: 'Grant or change a user\'s permission level on a Bitbucket repository (REPO_READ, REPO_WRITE, or REPO_ADMIN). Requires REPO_ADMIN permission (or higher project/global permission).',
      inputSchema: bitbucketToolSchemas.setRepoUserPermission,
    },
    async ({ projectKey, repositorySlug, name, permission }) => {
      const result = await service.setRepoUserPermission(projectKey, repositorySlug, name, permission);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_set_repo_group_permission',
    {
      description: 'Grant or change a group\'s permission level on a Bitbucket repository (REPO_READ, REPO_WRITE, or REPO_ADMIN). Requires REPO_ADMIN permission (or higher project/global permission).',
      inputSchema: bitbucketToolSchemas.setRepoGroupPermission,
    },
    async ({ projectKey, repositorySlug, name, permission }) => {
      const result = await service.setRepoGroupPermission(projectKey, repositorySlug, name, permission);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_revoke_repo_permission',
    {
      description: 'Revoke a user\'s and/or a group\'s permissions on a Bitbucket repository. Provide at least one of user or group. Requires REPO_ADMIN permission (or higher project/global permission).',
      inputSchema: bitbucketToolSchemas.revokeRepoPermission,
    },
    async ({ projectKey, repositorySlug, user, group }) => {
      const result = await service.revokeRepoPermission(projectKey, repositorySlug, user, group);

      return formatToolResponse(result);
    },
  );
}
