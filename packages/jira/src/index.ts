import { connectServer, createMcpServer, formatToolResponse, initializeRuntimeConfig } from '@mrrefactoring/atlassian-dc-mcp-core';
import { JiraService, jiraToolSchemas } from './jira-service.js';
import { getDefaultPageSize, getJiraRuntimeConfig } from './config.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

initializeRuntimeConfig();

const missingEnvVars = JiraService.validateConfig();
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const jiraConfig = getJiraRuntimeConfig();
const jiraService = new JiraService(
  jiraConfig.host,
  () => getJiraRuntimeConfig().token,
  jiraConfig.apiBasePath,
  getDefaultPageSize,
);

const server = createMcpServer({
  name: "atlassian-jira-mcp",
  version
});

const jiraInstanceType = "JIRA Data Center edition instance";

server.tool(
  "jira_searchIssues",
  `Search for JIRA issues using JQL in the ${jiraInstanceType}`,
  jiraToolSchemas.searchIssues,
  async ({ jql, expand, startAt, maxResults, fields }) => {
    const result = await jiraService.searchIssues(jql, startAt, expand, maxResults, fields);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssue",
  `Get details of a JIRA issue by its key from the ${jiraInstanceType}`,
  jiraToolSchemas.getIssue,
  async ({ issueKey, expand, fields }) => {
    const result = await jiraService.getIssue(issueKey, expand, fields);
    return formatToolResponse(result);
  }
);

server.tool(
  'jira_getIssueComments',
  `Get comments of a JIRA issue by its key from the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueComments,
  async ({ issueKey, expand, maxResults, startAt }) => {
    const result = await jiraService.getIssueComments(issueKey, expand, maxResults, startAt);
    return formatToolResponse(result);
  });

server.tool(
  "jira_createIssue",
  `Create a new JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.createIssue,
  async (params) => {
    const result = await jiraService.createIssue(params);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateIssue",
  `Update an existing JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.updateIssue,
  async (params) => {
    const result = await jiraService.updateIssue(params);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_postIssueComment",
  `Post a comment on a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.postIssueComment,
  async ({ issueKey, comment }) => {
    const result = await jiraService.postIssueComment(issueKey, comment);
    return formatToolResponse(result);
  }
)

server.tool(
  "jira_getTransitions",
  `Get available status transitions for a JIRA issue in the ${jiraInstanceType}. Returns a list of transitions with their IDs, names, and target statuses.`,
  jiraToolSchemas.getTransitions,
  async ({ issueKey }) => {
    const result = await jiraService.getTransitions(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueDevelopmentInfo",
  `Get linked development information (pull requests, commits, or branches) shown in the Development panel of a JIRA issue in the ${jiraInstanceType}. Defaults to pull requests from Bitbucket.`,
  jiraToolSchemas.getIssueDevelopmentInfo,
  async ({ issueKey, dataType, applicationType }) => {
    const result = await jiraService.getIssueDevelopmentInfo(issueKey, dataType, applicationType);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_transitionIssue",
  `Transition a JIRA issue to a new status in the ${jiraInstanceType}. Use jira_getTransitions first to get available transition IDs.`,
  jiraToolSchemas.transitionIssue,
  async (params) => {
    const result = await jiraService.transitionIssue(params);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjects",
  `Get all projects visible to the current user in the ${jiraInstanceType}`,
  jiraToolSchemas.getProjects,
  async ({ includeArchived, expand, recent }) => {
    const result = await jiraService.getProjects(includeArchived, expand, recent);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_searchProjects",
  `Search for projects by name or key using the picker-style search in the ${jiraInstanceType}`,
  jiraToolSchemas.searchProjects,
  async ({ query, maxResults, allowEmptyQuery }) => {
    const result = await jiraService.searchProjects(query, maxResults, allowEmptyQuery);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProject",
  `Get details of a single project by id or key from the ${jiraInstanceType}`,
  jiraToolSchemas.getProject,
  async ({ projectIdOrKey, expand }) => {
    const result = await jiraService.getProject(projectIdOrKey, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectComponents",
  `Get all components of a project from the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectComponents,
  async ({ projectIdOrKey }) => {
    const result = await jiraService.getProjectComponents(projectIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectVersions",
  `Get all versions of a project from the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectVersions,
  async ({ projectIdOrKey, expand }) => {
    const result = await jiraService.getProjectVersions(projectIdOrKey, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueTypes",
  `Get all issue types available in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueTypes,
  async () => {
    const result = await jiraService.getIssueTypes();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getPriorities",
  `Get all issue priorities available in the ${jiraInstanceType}`,
  jiraToolSchemas.getPriorities,
  async () => {
    const result = await jiraService.getPriorities();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getResolutions",
  `Get all issue resolutions available in the ${jiraInstanceType}`,
  jiraToolSchemas.getResolutions,
  async () => {
    const result = await jiraService.getResolutions();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getStatuses",
  `Get all issue statuses available in the ${jiraInstanceType}`,
  jiraToolSchemas.getStatuses,
  async () => {
    const result = await jiraService.getStatuses();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getCreateIssueMetaIssueTypes",
  `Get the issue types available for creating an issue in a project, in the ${jiraInstanceType}. Use before jira_createIssue to find a valid issueTypeId.`,
  jiraToolSchemas.getCreateIssueMetaIssueTypes,
  async ({ projectIdOrKey, maxResults, startAt }) => {
    const result = await jiraService.getCreateIssueMetaIssueTypes(projectIdOrKey, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getCreateIssueMetaFields",
  `Get the fields (required and optional) available for creating an issue of a given type in a project, in the ${jiraInstanceType}. Use before jira_createIssue to discover required fields.`,
  jiraToolSchemas.getCreateIssueMetaFields,
  async ({ projectIdOrKey, issueTypeId, maxResults, startAt }) => {
    const result = await jiraService.getCreateIssueMetaFields(projectIdOrKey, issueTypeId, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getEditIssueMeta",
  `Get the fields available for editing an existing issue, in the ${jiraInstanceType}. Use before jira_updateIssue to discover which fields can be edited.`,
  jiraToolSchemas.getEditIssueMeta,
  async ({ issueKey }) => {
    const result = await jiraService.getEditIssueMeta(issueKey);
    return formatToolResponse(result);
  }
);

await connectServer(server);
