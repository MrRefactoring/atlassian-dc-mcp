import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { jiraInstanceType } from './constants.js';
import type { JiraService } from './jiraService.js';

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

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'jira-project',
    new ResourceTemplate('jira://project/{projectKey}', { list: undefined }),
    {
      title: 'Jira project',
      description: `A project in the ${jiraInstanceType}, addressable by its key or id (e.g. jira://project/PROJ).`,
      mimeType: 'application/json',
    },
    async (uri, { projectKey }) => {
      const result = await service.getProject(firstValue(projectKey));

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'jira-board',
    new ResourceTemplate('jira://board/{boardId}', { list: undefined }),
    {
      title: 'Jira agile board',
      description: `An agile (Scrum/Kanban) board in the ${jiraInstanceType}, addressable by its numeric id (e.g. jira://board/42).`,
      mimeType: 'application/json',
    },
    async (uri, { boardId }) => {
      const result = await service.getBoard(Number(firstValue(boardId)));

      return jsonResource(uri.href, result);
    },
  );

  server.registerResource(
    'jira-user',
    new ResourceTemplate('jira://user/{username}', { list: undefined }),
    {
      title: 'Jira user',
      description: `A user in the ${jiraInstanceType}, addressable by username (e.g. jira://user/jsmith).`,
      mimeType: 'application/json',
    },
    async (uri, { username }) => {
      const result = await service.getUser(firstValue(username));

      return jsonResource(uri.href, result);
    },
  );
}
