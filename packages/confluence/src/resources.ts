import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { confluenceInstanceType } from './constants.js';
import type { ConfluenceService } from './confluenceService.js';

function firstValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
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
