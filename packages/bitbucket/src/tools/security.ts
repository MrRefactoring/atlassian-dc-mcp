import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse, registerAnnotatedTool } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerSecurityTools(server: McpServer, service: BitbucketService) {
  registerAnnotatedTool(server,
    'bitbucket_get_gpg_keys',
    {
      description: 'List the GPG keys for a user. Defaults to the currently authenticated user; retrieving another user\'s keys requires ADMIN permission.',
      inputSchema: bitbucketToolSchemas.getGpgKeys,
    },
    async ({ user, start, limit }) => {
      const result = await service.getGpgKeys(user, start, limit);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'bitbucket_add_gpg_key',
    {
      description: 'Add an ASCII-armored GPG public key for a user. Defaults to the currently authenticated user; adding for another user requires ADMIN permission.',
      inputSchema: bitbucketToolSchemas.addGpgKey,
    },
    async ({ text, user }) => {
      const result = await service.addGpgKey(text, user);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'bitbucket_delete_gpg_key',
    {
      description: 'Delete a GPG key by its ID or fingerprint.',
      inputSchema: bitbucketToolSchemas.deleteGpgKey,
    },
    async ({ fingerprintOrId }) => {
      const result = await service.deleteGpgKey(fingerprintOrId);

      return formatToolResponse(result);
    },
  );
}
