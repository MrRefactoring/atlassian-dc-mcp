import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerProjectTools(server: McpServer, service: BitbucketService) {
  server.tool(
    'bitbucket_getProjects',
    'Get a list of Bitbucket projects',
    bitbucketToolSchemas.getProjects,
    async ({ name, permission, start, limit }) => {
      const result = await service.getProjects(name, permission, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getProject',
    'Get a specific Bitbucket project by key',
    bitbucketToolSchemas.getProject,
    async ({ projectKey }) => {
      const result = await service.getProject(projectKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createProject',
    'Create a new Bitbucket project. Requires PROJECT_CREATE permission. The key must be unique.',
    bitbucketToolSchemas.createProject,
    async ({ key, name, description }) => {
      const result = await service.createProject(key, name, description);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_updateProject',
    'Update an existing Bitbucket project\'s name or description. Requires PROJECT_ADMIN permission. The project key is never changed. Only the provided fields are updated.',
    bitbucketToolSchemas.updateProject,
    async ({ key, name, description }) => {
      const result = await service.updateProject(key, name, description);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteProject',
    'Delete a Bitbucket project. Requires PROJECT_ADMIN permission. The project must contain no repositories or the call fails with a conflict.',
    bitbucketToolSchemas.deleteProject,
    async ({ key }) => {
      const result = await service.deleteProject(key);

      return formatToolResponse(result);
    },
  );
}
