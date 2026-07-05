import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerAgileTools(server: McpServer, service: JiraService) {
  server.registerTool(
    'jira_getBoards',
    {
      description: `Get Agile boards visible to the current user in the ${jiraInstanceType}, optionally filtered by name or project`,
      inputSchema: jiraToolSchemas.getBoards,
    },
    async ({ maxResults, name, projectKeyOrId, startAt }) => {
      const result = await service.getBoards(maxResults, name, projectKeyOrId, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoard',
    {
      description: `Get a single Agile board by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoard,
    },
    async ({ boardId }) => {
      const result = await service.getBoard(boardId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardConfiguration',
    {
      description: `Get the configuration (columns, estimation, ranking) of an Agile board in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoardConfiguration,
    },
    async ({ boardId }) => {
      const result = await service.getBoardConfiguration(boardId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardIssues',
    {
      description: `Get the issues on an Agile board in the ${jiraInstanceType}, optionally filtered by JQL`,
      inputSchema: jiraToolSchemas.getBoardIssues,
    },
    async ({ boardId, jql, maxResults, startAt }) => {
      const result = await service.getBoardIssues(boardId, jql, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardSprints',
    {
      description: `Get the sprints of an Agile board in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoardSprints,
    },
    async ({ boardId, maxResults, startAt }) => {
      const result = await service.getBoardSprints(boardId, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardVersions',
    {
      description: `Get the versions of an Agile board's project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoardVersions,
    },
    async ({ boardId, maxResults, startAt }) => {
      const result = await service.getBoardVersions(boardId, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardBacklogIssues',
    {
      description: `Get the backlog issues of an Agile board in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoardBacklogIssues,
    },
    async ({ boardId, jql, maxResults, startAt }) => {
      const result = await service.getBoardBacklogIssues(boardId, jql, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardEpics',
    {
      description: `Get the epics of an Agile board in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoardEpics,
    },
    async ({ boardId, maxResults, done, startAt }) => {
      const result = await service.getBoardEpics(boardId, maxResults, done, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardIssuesWithoutEpic',
    {
      description: `Get the issues on an Agile board that are not assigned to any epic, in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoardIssuesWithoutEpic,
    },
    async ({ boardId, jql, maxResults, startAt }) => {
      const result = await service.getBoardIssuesWithoutEpic(boardId, jql, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getBoardEpicIssues',
    {
      description: `Get the issues assigned to a specific epic on an Agile board in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getBoardEpicIssues,
    },
    async ({ boardId, epicId, jql, maxResults, startAt }) => {
      const result = await service.getBoardEpicIssues(boardId, epicId, jql, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_moveIssuesToBacklog',
    {
      description: `Move issues to the backlog in the ${jiraInstanceType}, removing them from any sprint`,
      inputSchema: jiraToolSchemas.moveIssuesToBacklog,
    },
    async ({ issueKeys }) => {
      const result = await service.moveIssuesToBacklog(issueKeys);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createSprint',
    {
      description: `Create a sprint on an Agile board in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createSprint,
    },
    async ({ name, originBoardId, startDate, endDate, goal }) => {
      const result = await service.createSprint(name, originBoardId, startDate, endDate, goal);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getSprint',
    {
      description: `Get a single sprint by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getSprint,
    },
    async ({ sprintId }) => {
      const result = await service.getSprint(sprintId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateSprint',
    {
      description: `Update a sprint in the ${jiraInstanceType}, including starting or closing it via the state field`,
      inputSchema: jiraToolSchemas.updateSprint,
    },
    async ({ sprintId, name, startDate, endDate, goal, state }) => {
      const result = await service.updateSprint(sprintId, name, startDate, endDate, goal, state);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteSprint',
    {
      description: `Delete a sprint from the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteSprint,
    },
    async ({ sprintId }) => {
      const result = await service.deleteSprint(sprintId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getSprintIssues',
    {
      description: `Get the issues in a sprint in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getSprintIssues,
    },
    async ({ sprintId, jql, maxResults, startAt }) => {
      const result = await service.getSprintIssues(sprintId, jql, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_moveIssuesToSprint',
    {
      description: `Move issues into a sprint in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.moveIssuesToSprint,
    },
    async ({ sprintId, issueKeys }) => {
      const result = await service.moveIssuesToSprint(sprintId, issueKeys);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getEpic',
    {
      description: `Get a single epic by id or issue key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getEpic,
    },
    async ({ epicIdOrKey }) => {
      const result = await service.getEpic(epicIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateEpic',
    {
      description: `Update an epic (name, summary, done status) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateEpic,
    },
    async ({ epicIdOrKey, name, summary, done }) => {
      const result = await service.updateEpic(epicIdOrKey, name, summary, done);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getEpicIssues',
    {
      description: `Get the issues assigned to an epic in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getEpicIssues,
    },
    async ({ epicIdOrKey, jql, maxResults, startAt }) => {
      const result = await service.getEpicIssues(epicIdOrKey, jql, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_moveIssuesToEpic',
    {
      description: `Move issues into an epic in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.moveIssuesToEpic,
    },
    async ({ epicIdOrKey, issueKeys }) => {
      const result = await service.moveIssuesToEpic(epicIdOrKey, issueKeys);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_rankEpic',
    {
      description: `Reorder (rank) an epic relative to another epic in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.rankEpic,
    },
    async ({ epicIdOrKey, rankBeforeEpic, rankAfterEpic, rankCustomFieldId }) => {
      const result = await service.rankEpic(epicIdOrKey, rankBeforeEpic, rankAfterEpic, rankCustomFieldId);

      return formatToolResponse(result);
    },
  );
}
