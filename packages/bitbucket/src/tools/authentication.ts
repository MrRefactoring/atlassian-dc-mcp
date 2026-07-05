import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerAuthenticationTools(server: McpServer, service: BitbucketService) {
  server.tool(
    'bitbucket_getAccessTokens',
    'Get HTTP access tokens (PATs) for a user, project, or repository. Set scope to \'user\' (with userSlug), \'project\' (with projectKey), or \'repo\' (with projectKey and repositorySlug).',
    bitbucketToolSchemas.getAccessTokens,
    async ({ scope, userSlug, projectKey, repositorySlug, start, limit }) => {
      const result = await service.getAccessTokens(scope, userSlug, projectKey, repositorySlug, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createAccessToken',
    'Create an HTTP access token (PAT) for a user, project, or repository. Set scope to \'user\' (with userSlug), \'project\' (with projectKey), or \'repo\' (with projectKey and repositorySlug). The raw token value is only returned once, in the response of this call.',
    bitbucketToolSchemas.createAccessToken,
    async ({ scope, name, permissions, expiryDays, userSlug, projectKey, repositorySlug }) => {
      const result = await service.createAccessToken(scope, name, permissions, expiryDays, userSlug, projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteAccessToken',
    'Delete an HTTP access token (PAT) from a user, project, or repository by its ID. Set scope to \'user\' (with userSlug), \'project\' (with projectKey), or \'repo\' (with projectKey and repositorySlug).',
    bitbucketToolSchemas.deleteAccessToken,
    async ({ scope, tokenId, userSlug, projectKey, repositorySlug }) => {
      const result = await service.deleteAccessToken(scope, tokenId, userSlug, projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getSshKeys',
    'List the SSH keys for a user. Defaults to the currently authenticated user; retrieving another user\'s keys requires ADMIN permission.',
    bitbucketToolSchemas.getSshKeys,
    async ({ userName, start, limit }) => {
      const result = await service.getSshKeys(userName, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_addSshKey',
    'Add an SSH public key for a user. Defaults to the currently authenticated user; adding for another user requires ADMIN permission.',
    bitbucketToolSchemas.addSshKey,
    async ({ text, userName }) => {
      const result = await service.addSshKey(text, userName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteSshKey',
    'Delete an SSH key by its ID. Requires ADMIN permission.',
    bitbucketToolSchemas.deleteSshKey,
    async ({ keyId }) => {
      const result = await service.deleteSshKey(keyId);

      return formatToolResponse(result);
    },
  );
}
