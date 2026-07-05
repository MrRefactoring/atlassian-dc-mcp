import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BitbucketService } from './bitbucketService.js';

function firstValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

export function registerResources(server: McpServer, service: BitbucketService) {
  server.registerResource(
    'bitbucket-repository',
    new ResourceTemplate('bitbucket://repo/{projectKey}/{repositorySlug}', { list: undefined }),
    {
      title: 'Bitbucket repository',
      description: 'A repository in a Bitbucket Data Center edition instance, addressable by project key and repository slug (e.g. bitbucket://repo/PROJ/my-repo).',
      mimeType: 'application/json',
    },
    async (uri, { projectKey, repositorySlug }) => {
      const result = await service.getRepository(firstValue(projectKey), firstValue(repositorySlug));

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );

  server.registerResource(
    'bitbucket-pull-request',
    new ResourceTemplate('bitbucket://pr/{projectKey}/{repositorySlug}/{pullRequestId}', { list: undefined }),
    {
      title: 'Bitbucket pull request',
      description: 'A pull request in a Bitbucket Data Center edition instance, addressable by project key, repository slug, and pull request ID (e.g. bitbucket://pr/PROJ/my-repo/42).',
      mimeType: 'application/json',
    },
    async (uri, { projectKey, repositorySlug, pullRequestId }) => {
      const result = await service.getPullRequest(
        firstValue(projectKey),
        firstValue(repositorySlug),
        firstValue(pullRequestId),
      );

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );
}
