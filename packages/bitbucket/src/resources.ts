import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { BitbucketService } from './bitbucketService.js';

function firstValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

function jsonResource(uriHref: string, result: unknown) {
  return {
    contents: [
      {
        uri: uriHref,
        mimeType: 'application/json',
        text: JSON.stringify(result),
      },
    ],
  };
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

      return jsonResource(uri.href, result);
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

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'bitbucket-project',
    new ResourceTemplate('bitbucket://project/{projectKey}', { list: undefined }),
    {
      title: 'Bitbucket project',
      description: 'A project in a Bitbucket Data Center edition instance, addressable by project key (e.g. bitbucket://project/PROJ).',
      mimeType: 'application/json',
    },
    async (uri, { projectKey }) => {
      const result = await service.getProject(firstValue(projectKey));

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'bitbucket-commit',
    new ResourceTemplate('bitbucket://commit/{projectKey}/{repositorySlug}/{commitId}', { list: undefined }),
    {
      title: 'Bitbucket commit',
      description: 'A commit in a Bitbucket Data Center edition instance, addressable by project key, repository slug, and commit id (e.g. bitbucket://commit/PROJ/my-repo/abc123).',
      mimeType: 'application/json',
    },
    async (uri, { projectKey, repositorySlug, commitId }) => {
      const result = await service.getCommit(
        firstValue(projectKey),
        firstValue(repositorySlug),
        firstValue(commitId),
      );

      return jsonResource(uri.href, result);
    },
  );
}
