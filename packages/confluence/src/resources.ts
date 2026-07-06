import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { confluenceInstanceType } from './constants.js';
import type { ConfluenceService } from './confluenceService.js';

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

export function registerResources(server: McpServer, service: ConfluenceService) {
  server.registerResource(
    'confluence-page',
    new ResourceTemplate('confluence://page/{pageId}', { list: undefined }),
    {
      title: 'Confluence page',
      description: `A content item (page, blog post, ...) in ${confluenceInstanceType}, addressable by its content ID (e.g. confluence://page/123456).`,
      mimeType: 'application/json',
    },
    async (uri, { pageId }) => {
      const result = await service.getContent(firstValue(pageId));

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'confluence-space',
    new ResourceTemplate('confluence://space/{spaceKey}', { list: undefined }),
    {
      title: 'Confluence space',
      description: `A space in ${confluenceInstanceType}, addressable by its key (e.g. confluence://space/ENG).`,
      mimeType: 'application/json',
    },
    async (uri, { spaceKey }) => {
      const result = await service.getSpace(firstValue(spaceKey));

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'confluence-space-content',
    new ResourceTemplate('confluence://space/{spaceKey}/content', { list: undefined }),
    {
      title: 'Confluence space content',
      description: `The top-level content (pages and blog posts) of a space in ${confluenceInstanceType}, addressable by space key (e.g. confluence://space/ENG/content).`,
      mimeType: 'application/json',
    },
    async (uri, { spaceKey }) => {
      const result = await service.getSpaceContent(firstValue(spaceKey));

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'confluence-user',
    new ResourceTemplate('confluence://user/{username}', { list: undefined }),
    {
      title: 'Confluence user',
      description: `A user in ${confluenceInstanceType}, addressable by username (e.g. confluence://user/jsmith).`,
      mimeType: 'application/json',
    },
    async (uri, { username }) => {
      const result = await service.getUser(undefined, firstValue(username));

      return jsonResource(uri.href, result);
    },
  );
}
