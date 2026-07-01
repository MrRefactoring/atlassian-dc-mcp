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

server.tool(
  "jira_deleteIssue",
  `Delete a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteIssue,
  async ({ issueKey, deleteSubtasks }) => {
    const result = await jiraService.deleteIssue(issueKey, deleteSubtasks);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateIssueComment",
  `Update the text of an existing comment on a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.updateIssueComment,
  async ({ issueKey, commentId, comment }) => {
    const result = await jiraService.updateIssueComment(issueKey, commentId, comment);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteIssueComment",
  `Delete a comment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteIssueComment,
  async ({ issueKey, commentId }) => {
    const result = await jiraService.deleteIssueComment(issueKey, commentId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueWatchers",
  `Get the list of users watching a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueWatchers,
  async ({ issueKey }) => {
    const result = await jiraService.getIssueWatchers(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addIssueWatcher",
  `Add a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.addIssueWatcher,
  async ({ issueKey, username }) => {
    const result = await jiraService.addIssueWatcher(issueKey, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_removeIssueWatcher",
  `Remove a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.removeIssueWatcher,
  async ({ issueKey, username }) => {
    const result = await jiraService.removeIssueWatcher(issueKey, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueVotes",
  `Get vote information for a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueVotes,
  async ({ issueKey }) => {
    const result = await jiraService.getIssueVotes(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addIssueVote",
  `Cast a vote for a JIRA issue in the ${jiraInstanceType} (as the current user)`,
  jiraToolSchemas.addIssueVote,
  async ({ issueKey }) => {
    const result = await jiraService.addIssueVote(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_removeIssueVote",
  `Remove the current user's vote from a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.removeIssueVote,
  async ({ issueKey }) => {
    const result = await jiraService.removeIssueVote(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueWorklogs",
  `Get all worklog entries of a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueWorklogs,
  async ({ issueKey }) => {
    const result = await jiraService.getIssueWorklogs(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addIssueWorklog",
  `Add a worklog entry (time tracking) to a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.addIssueWorklog,
  async ({ issueKey, timeSpent, comment, started }) => {
    const result = await jiraService.addIssueWorklog(issueKey, timeSpent, comment, started);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueWorklog",
  `Get a single worklog entry of a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueWorklog,
  async ({ issueKey, worklogId }) => {
    const result = await jiraService.getIssueWorklog(issueKey, worklogId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateIssueWorklog",
  `Update a worklog entry of a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.updateIssueWorklog,
  async ({ issueKey, worklogId, timeSpent, comment, started }) => {
    const result = await jiraService.updateIssueWorklog(issueKey, worklogId, timeSpent, comment, started);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteIssueWorklog",
  `Delete a worklog entry from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteIssueWorklog,
  async ({ issueKey, worklogId }) => {
    const result = await jiraService.deleteIssueWorklog(issueKey, worklogId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addIssueAttachment",
  `Attach a file to a JIRA issue in the ${jiraInstanceType}. Provide file content as base64.`,
  jiraToolSchemas.addIssueAttachment,
  async ({ issueKey, fileName, contentBase64 }) => {
    const result = await jiraService.addIssueAttachment(issueKey, fileName, contentBase64);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getAttachmentMeta",
  `Get attachment capabilities (enabled/disabled, max upload size) of the ${jiraInstanceType}`,
  jiraToolSchemas.getAttachmentMeta,
  async () => {
    const result = await jiraService.getAttachmentMeta();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getAttachment",
  `Get metadata (including download URI) for an attachment in the ${jiraInstanceType}`,
  jiraToolSchemas.getAttachment,
  async ({ attachmentId }) => {
    const result = await jiraService.getAttachment(attachmentId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteAttachment",
  `Delete an attachment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteAttachment,
  async ({ attachmentId }) => {
    const result = await jiraService.deleteAttachment(attachmentId);
    return formatToolResponse(result);
  }
);

await connectServer(server);
