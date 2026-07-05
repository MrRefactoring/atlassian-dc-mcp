import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerSecurityTools(server: McpServer, service: BitbucketService) {
  server.tool(
    'bitbucket_getGpgKeys',
    'List the GPG keys for a user. Defaults to the currently authenticated user; retrieving another user\'s keys requires ADMIN permission.',
    bitbucketToolSchemas.getGpgKeys,
    async ({ user, start, limit }) => {
      const result = await service.getGpgKeys(user, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_addGpgKey',
    'Add an ASCII-armored GPG public key for a user. Defaults to the currently authenticated user; adding for another user requires ADMIN permission.',
    bitbucketToolSchemas.addGpgKey,
    async ({ text, user }) => {
      const result = await service.addGpgKey(text, user);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteGpgKey',
    'Delete a GPG key by its ID or fingerprint.',
    bitbucketToolSchemas.deleteGpgKey,
    async ({ fingerprintOrId }) => {
      const result = await service.deleteGpgKey(fingerprintOrId);

      return formatToolResponse(result);
    },
  );
}
