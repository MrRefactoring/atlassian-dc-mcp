import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { jiraInstanceType } from './constants.js';
import type { JiraService } from './jiraService.js';

function firstValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

export function registerResources(server: McpServer, service: JiraService) {
  server.registerResource(
    'jira-issue',
    new ResourceTemplate('jira://issue/{issueKey}', { list: undefined }),
    {
      title: 'Jira issue',
      description: `An issue in the ${jiraInstanceType}, addressable by its key (e.g. jira://issue/PROJ-123).`,
      mimeType: 'application/json',
    },
    async (uri, { issueKey }) => {
      const result = await service.getIssue(firstValue(issueKey));

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
