import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerProjectTools(server: McpServer, service: BitbucketService) {
  server.registerTool(
    'bitbucket_get_projects',
    {
      description: 'Get a list of Bitbucket projects',
      inputSchema: bitbucketToolSchemas.getProjects,
    },
    async ({ name, permission, start, limit }) => {
      const result = await service.getProjects(name, permission, start, limit);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_get_project',
    {
      description: 'Get a specific Bitbucket project by key',
      inputSchema: bitbucketToolSchemas.getProject,
    },
    async ({ projectKey }) => {
      const result = await service.getProject(projectKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_create_project',
    {
      description: 'Create a new Bitbucket project. Requires PROJECT_CREATE permission. The key must be unique.',
      inputSchema: bitbucketToolSchemas.createProject,
    },
    async ({ key, name, description }) => {
      const result = await service.createProject(key, name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_update_project',
    {
      description: 'Update an existing Bitbucket project\'s name or description. Requires PROJECT_ADMIN permission. The project key is never changed. Only the provided fields are updated.',
      inputSchema: bitbucketToolSchemas.updateProject,
    },
    async ({ key, name, description }) => {
      const result = await service.updateProject(key, name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_delete_project',
    {
      description: 'Delete a Bitbucket project. Requires PROJECT_ADMIN permission. The project must contain no repositories or the call fails with a conflict.',
      inputSchema: bitbucketToolSchemas.deleteProject,
    },
    async ({ key }) => {
      const result = await service.deleteProject(key);

      return formatToolResponse(result);
    },
  );
}
