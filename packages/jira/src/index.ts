import { connectServer, createMcpServer, formatToolResponse, initializeRuntimeConfig } from 'datacenter-mcp-core';
import { JiraService, jiraToolSchemas } from './jira-service.js';
import { getDefaultPageSize, getJiraRuntimeConfig } from './config.js';
import { createRequire } from 'node:module';
import { z } from 'zod';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

function firstValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

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
  () => getJiraRuntimeConfig().username,
  () => getJiraRuntimeConfig().password,
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
  "jira_createProject",
  `Create a new project in the ${jiraInstanceType}`,
  jiraToolSchemas.createProject,
  async ({ key, name, projectTypeKey, projectTemplateKey, description, lead, url, assigneeType, avatarId, issueSecurityScheme, permissionScheme, notificationScheme, categoryId, workflowSchemeId }) => {
    const result = await jiraService.createProject({
      key,
      name,
      projectTypeKey,
      projectTemplateKey,
      description,
      lead,
      url,
      assigneeType,
      avatarId,
      issueSecurityScheme,
      permissionScheme,
      notificationScheme,
      categoryId,
      workflowSchemeId
    });
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateProject",
  `Update an existing project in the ${jiraInstanceType}. Only non-null values sent are updated.`,
  jiraToolSchemas.updateProject,
  async ({ projectIdOrKey, name, key, description, lead, url, assigneeType, avatarId, issueSecurityScheme, permissionScheme, notificationScheme, categoryId, projectTypeKey, expand }) => {
    const result = await jiraService.updateProject(projectIdOrKey, {
      name,
      key,
      description,
      lead,
      url,
      assigneeType,
      avatarId,
      issueSecurityScheme,
      permissionScheme,
      notificationScheme,
      categoryId,
      projectTypeKey
    }, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteProject",
  `Delete a project from the ${jiraInstanceType}. WARNING: this is irreversible.`,
  jiraToolSchemas.deleteProject,
  async ({ projectIdOrKey }) => {
    const result = await jiraService.deleteProject(projectIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_archiveProject",
  `Archive a project in the ${jiraInstanceType}`,
  jiraToolSchemas.archiveProject,
  async ({ projectIdOrKey }) => {
    const result = await jiraService.archiveProject(projectIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_restoreProject",
  `Restore a previously archived project in the ${jiraInstanceType}`,
  jiraToolSchemas.restoreProject,
  async ({ projectIdOrKey }) => {
    const result = await jiraService.restoreProject(projectIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectPropertyKeys",
  `Get the keys of all entity properties stored on a project in the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectPropertyKeys,
  async ({ projectIdOrKey }) => {
    const result = await jiraService.getProjectPropertyKeys(projectIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectProperty",
  `Get a single entity property value from a project in the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectProperty,
  async ({ projectIdOrKey, propertyKey }) => {
    const result = await jiraService.getProjectProperty(projectIdOrKey, propertyKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setProjectProperty",
  `Set an entity property (arbitrary JSON key/value metadata) on a project in the ${jiraInstanceType}`,
  jiraToolSchemas.setProjectProperty,
  async ({ projectIdOrKey, propertyKey, value }) => {
    const result = await jiraService.setProjectProperty(projectIdOrKey, propertyKey, value);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteProjectProperty",
  `Delete an entity property from a project in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteProjectProperty,
  async ({ projectIdOrKey, propertyKey }) => {
    const result = await jiraService.deleteProjectProperty(projectIdOrKey, propertyKey);
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
  "jira_getCommentPropertyKeys",
  `Get the keys of all entity properties stored on a comment in the ${jiraInstanceType}`,
  jiraToolSchemas.getCommentPropertyKeys,
  async ({ commentId }) => {
    const result = await jiraService.getCommentPropertyKeys(commentId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getCommentProperty",
  `Get a single entity property value from a comment in the ${jiraInstanceType}`,
  jiraToolSchemas.getCommentProperty,
  async ({ commentId, propertyKey }) => {
    const result = await jiraService.getCommentProperty(commentId, propertyKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setCommentProperty",
  `Set an entity property (arbitrary JSON key/value metadata) on a comment in the ${jiraInstanceType}`,
  jiraToolSchemas.setCommentProperty,
  async ({ commentId, propertyKey, value }) => {
    const result = await jiraService.setCommentProperty(commentId, propertyKey, value);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteCommentProperty",
  `Delete an entity property from a comment in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteCommentProperty,
  async ({ commentId, propertyKey }) => {
    const result = await jiraService.deleteCommentProperty(commentId, propertyKey);
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
  "jira_getWorklogsDeletedSince",
  `Get the ids of worklogs deleted since a given time across the whole ${jiraInstanceType}, for bulk sync`,
  jiraToolSchemas.getWorklogsDeletedSince,
  async ({ since }) => {
    const result = await jiraService.getWorklogsDeletedSince(since);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getWorklogsModifiedSince",
  `Get the ids of worklogs modified since a given time across the whole ${jiraInstanceType}, for bulk sync`,
  jiraToolSchemas.getWorklogsModifiedSince,
  async ({ since }) => {
    const result = await jiraService.getWorklogsModifiedSince(since);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getWorklogsForIds",
  `Get worklog details for a batch of worklog ids in the ${jiraInstanceType}`,
  jiraToolSchemas.getWorklogsForIds,
  async ({ worklogIds }) => {
    const result = await jiraService.getWorklogsForIds(worklogIds);
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
  "jira_getAttachmentContent",
  `Download the raw content of an attachment from the ${jiraInstanceType} as base64. Fetches the file behind the attachment's download URI.`,
  jiraToolSchemas.getAttachmentContent,
  async ({ attachmentId }) => {
    const result = await jiraService.getAttachmentContent(attachmentId);
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

server.tool(
  "jira_linkIssues",
  `Create a link between two JIRA issues in the ${jiraInstanceType} (e.g., "blocks", "relates to")`,
  jiraToolSchemas.linkIssues,
  async ({ inwardIssueKey, outwardIssueKey, linkTypeName, comment }) => {
    const result = await jiraService.linkIssues(inwardIssueKey, outwardIssueKey, linkTypeName, comment);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueLink",
  `Get details of a link between two JIRA issues in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueLink,
  async ({ linkId }) => {
    const result = await jiraService.getIssueLink(linkId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteIssueLink",
  `Delete a link between two JIRA issues in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteIssueLink,
  async ({ linkId }) => {
    const result = await jiraService.deleteIssueLink(linkId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getRemoteIssueLinks",
  `Get the remote issue links (e.g., links to Confluence pages or external URLs) for a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getRemoteIssueLinks,
  async ({ issueIdOrKey, globalId }) => {
    const result = await jiraService.getRemoteIssueLinks(issueIdOrKey, globalId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getRemoteIssueLink",
  `Get a single remote issue link by its id from the ${jiraInstanceType}`,
  jiraToolSchemas.getRemoteIssueLink,
  async ({ issueIdOrKey, linkId }) => {
    const result = await jiraService.getRemoteIssueLink(issueIdOrKey, linkId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createOrUpdateRemoteIssueLink",
  `Create a remote issue link on a JIRA issue in the ${jiraInstanceType} (e.g., link to a Confluence page or external URL). If globalId is provided and a link with that globalId already exists, it is updated instead of duplicated.`,
  jiraToolSchemas.createOrUpdateRemoteIssueLink,
  async ({ issueIdOrKey, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
    const result = await jiraService.createOrUpdateRemoteIssueLink(issueIdOrKey, { url, title, summary, globalId, relationship, applicationName, applicationType });
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateRemoteIssueLink",
  `Update a remote issue link by its id on a JIRA issue in the ${jiraInstanceType}. Any fields not provided are set to null.`,
  jiraToolSchemas.updateRemoteIssueLink,
  async ({ issueIdOrKey, linkId, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
    const result = await jiraService.updateRemoteIssueLink(issueIdOrKey, linkId, { url, title, summary, globalId, relationship, applicationName, applicationType });
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteRemoteIssueLink",
  `Delete a remote issue link by its id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteRemoteIssueLink,
  async ({ issueIdOrKey, linkId }) => {
    const result = await jiraService.deleteRemoteIssueLink(issueIdOrKey, linkId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteRemoteIssueLinkByGlobalId",
  `Delete a remote issue link by its global id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteRemoteIssueLinkByGlobalId,
  async ({ issueIdOrKey, globalId }) => {
    const result = await jiraService.deleteRemoteIssueLinkByGlobalId(issueIdOrKey, globalId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_assignIssue",
  `Assign or unassign a JIRA issue in the ${jiraInstanceType} via the dedicated assignee endpoint. Equivalent to setting the assignee field via jira_updateIssue, but simpler for this one common case.`,
  jiraToolSchemas.assignIssue,
  async ({ issueKey, username }) => {
    const result = await jiraService.assignIssue(issueKey, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createComponent",
  `Create a component in a project in the ${jiraInstanceType}`,
  jiraToolSchemas.createComponent,
  async ({ projectKey, name, description, leadUserName }) => {
    const result = await jiraService.createComponent(projectKey, name, description, leadUserName);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getComponents",
  `Get a paginated list of components in the ${jiraInstanceType}, optionally filtered by project or name query`,
  jiraToolSchemas.getComponents,
  async ({ maxResults, query, projectIds }) => {
    const result = await jiraService.getComponents(maxResults, query, projectIds);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getComponent",
  `Get a single component by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getComponent,
  async ({ componentId }) => {
    const result = await jiraService.getComponent(componentId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateComponent",
  `Update a component in the ${jiraInstanceType}`,
  jiraToolSchemas.updateComponent,
  async ({ componentId, name, description, leadUserName }) => {
    const result = await jiraService.updateComponent(componentId, name, description, leadUserName);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteComponent",
  `Delete a component from the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteComponent,
  async ({ componentId, moveIssuesTo }) => {
    const result = await jiraService.deleteComponent(componentId, moveIssuesTo);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getComponentRelatedIssues",
  `Get counts of issues related to a component in the ${jiraInstanceType}`,
  jiraToolSchemas.getComponentRelatedIssues,
  async ({ componentId }) => {
    const result = await jiraService.getComponentRelatedIssues(componentId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createVersion",
  `Create a version in a project in the ${jiraInstanceType}`,
  jiraToolSchemas.createVersion,
  async ({ projectKey, name, description, releaseDate, startDate }) => {
    const result = await jiraService.createVersion(projectKey, name, description, releaseDate, startDate);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getVersions",
  `Get a paginated list of versions in the ${jiraInstanceType}, optionally filtered by project or name query`,
  jiraToolSchemas.getVersions,
  async ({ projectIds, query, maxResults, startAt }) => {
    const result = await jiraService.getVersions(projectIds, query, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getVersion",
  `Get a single version by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getVersion,
  async ({ versionId, expand }) => {
    const result = await jiraService.getVersion(versionId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateVersion",
  `Update a version in the ${jiraInstanceType}`,
  jiraToolSchemas.updateVersion,
  async ({ versionId, name, description, released, archived, releaseDate }) => {
    const result = await jiraService.updateVersion(versionId, name, description, released, archived, releaseDate);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteAndReplaceVersion",
  `Delete a version from the ${jiraInstanceType}, moving affected/fix-version issues to replacement versions. This is irreversible.`,
  jiraToolSchemas.deleteAndReplaceVersion,
  async ({ versionId, moveFixIssuesTo, moveAffectedIssuesTo }) => {
    const result = await jiraService.deleteAndReplaceVersion(versionId, moveFixIssuesTo, moveAffectedIssuesTo);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_mergeVersion",
  `Merge a version into another version in the ${jiraInstanceType}, moving all its issues to the target version. This is irreversible.`,
  jiraToolSchemas.mergeVersion,
  async ({ versionId, moveIssuesToVersionId }) => {
    const result = await jiraService.mergeVersion(versionId, moveIssuesToVersionId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_moveVersion",
  `Reposition a version within its project's version sequence in the ${jiraInstanceType}`,
  jiraToolSchemas.moveVersion,
  async ({ versionId, position, after }) => {
    const result = await jiraService.moveVersion(versionId, position, after);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getVersionRelatedIssues",
  `Get counts of issues related to a version in the ${jiraInstanceType}`,
  jiraToolSchemas.getVersionRelatedIssues,
  async ({ versionId }) => {
    const result = await jiraService.getVersionRelatedIssues(versionId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getVersionUnresolvedIssues",
  `Get the count of unresolved issues for a version in the ${jiraInstanceType}`,
  jiraToolSchemas.getVersionUnresolvedIssues,
  async ({ versionId }) => {
    const result = await jiraService.getVersionUnresolvedIssues(versionId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectRoles",
  `Get the project roles defined for a project in the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectRoles,
  async ({ projectIdOrKey }) => {
    const result = await jiraService.getProjectRoles(projectIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectRole",
  `Get details (including current actors) for a single project role in the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectRole,
  async ({ projectIdOrKey, roleId }) => {
    const result = await jiraService.getProjectRole(projectIdOrKey, roleId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setProjectRoleActors",
  `Replace all actors (users/groups) of a project role in the ${jiraInstanceType}`,
  jiraToolSchemas.setProjectRoleActors,
  async ({ projectIdOrKey, roleId, categorisedActors }) => {
    const result = await jiraService.setProjectRoleActors(projectIdOrKey, roleId, categorisedActors);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addProjectRoleActors",
  `Add users and/or groups as actors of a project role in the ${jiraInstanceType}, without affecting existing actors`,
  jiraToolSchemas.addProjectRoleActors,
  async ({ projectIdOrKey, roleId, users, groups }) => {
    const result = await jiraService.addProjectRoleActors(projectIdOrKey, roleId, users, groups);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteProjectRoleActor",
  `Remove a single user or group actor from a project role in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteProjectRoleActor,
  async ({ projectIdOrKey, roleId, user, group }) => {
    const result = await jiraService.deleteProjectRoleActor(projectIdOrKey, roleId, user, group);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getUser",
  `Get details of a single user by username or key from the ${jiraInstanceType}`,
  jiraToolSchemas.getUser,
  async ({ username, key, includeDeleted }) => {
    const result = await jiraService.getUser(username, key, includeDeleted);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_findUsers",
  `Search for users by free-text query in the ${jiraInstanceType}`,
  jiraToolSchemas.findUsers,
  async ({ username, maxResults, startAt, includeActive, includeInactive }) => {
    const result = await jiraService.findUsers(username, maxResults, startAt, includeActive, includeInactive);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_findAssignableUsers",
  `Search for users assignable to a project or issue in the ${jiraInstanceType}. Use before jira_assignIssue to find valid candidates.`,
  jiraToolSchemas.findAssignableUsers,
  async ({ project, issueKey, username, maxResults }) => {
    const result = await jiraService.findAssignableUsers(project, issueKey, username, maxResults);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createGroup",
  `Create a group in the ${jiraInstanceType}`,
  jiraToolSchemas.createGroup,
  async ({ name }) => {
    const result = await jiraService.createGroup(name);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteGroup",
  `Delete a group from the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteGroup,
  async ({ groupname, swapGroup }) => {
    const result = await jiraService.deleteGroup(groupname, swapGroup);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getGroupUsers",
  `Get the members of a group in the ${jiraInstanceType}`,
  jiraToolSchemas.getGroupUsers,
  async ({ groupname, includeInactiveUsers, maxResults, startAt }) => {
    const result = await jiraService.getGroupUsers(groupname, includeInactiveUsers, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addUserToGroup",
  `Add a user to a group in the ${jiraInstanceType}`,
  jiraToolSchemas.addUserToGroup,
  async ({ groupname, username }) => {
    const result = await jiraService.addUserToGroup(groupname, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_removeUserFromGroup",
  `Remove a user from a group in the ${jiraInstanceType}`,
  jiraToolSchemas.removeUserFromGroup,
  async ({ groupname, username }) => {
    const result = await jiraService.removeUserFromGroup(groupname, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_findGroups",
  `Search for groups by a substring match against group names in the ${jiraInstanceType}. Used for group-picker style autocomplete.`,
  jiraToolSchemas.findGroups,
  async ({ query, maxResults, exclude, userName }) => {
    const result = await jiraService.findGroups(query, maxResults, exclude, userName);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_findUsersAndGroups",
  `Search for users and groups matching a query, with match highlighting, in the ${jiraInstanceType}. Used for combined user/group-picker style autocomplete fields such as assignee, reporter, or a group-picker custom field.`,
  jiraToolSchemas.findUsersAndGroups,
  async ({ query, maxResults, showAvatar, issueTypeId, projectId, fieldId }) => {
    const result = await jiraService.findUsersAndGroups(query, maxResults, showAvatar, issueTypeId, projectId, fieldId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createFilter",
  `Create a saved search filter in the ${jiraInstanceType}`,
  jiraToolSchemas.createFilter,
  async ({ name, jql, description, favourite }) => {
    const result = await jiraService.createFilter(name, jql, description, favourite);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getFilter",
  `Get a saved search filter by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getFilter,
  async ({ filterId, expand }) => {
    const result = await jiraService.getFilter(filterId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateFilter",
  `Update a saved search filter in the ${jiraInstanceType}`,
  jiraToolSchemas.updateFilter,
  async ({ filterId, name, jql, description, favourite }) => {
    const result = await jiraService.updateFilter(filterId, name, jql, description, favourite);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteFilter",
  `Delete a saved search filter from the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteFilter,
  async ({ filterId }) => {
    const result = await jiraService.deleteFilter(filterId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getFavouriteFilters",
  `Get the current user's favourite saved search filters in the ${jiraInstanceType}`,
  jiraToolSchemas.getFavouriteFilters,
  async () => {
    const result = await jiraService.getFavouriteFilters();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getDashboards",
  `Get a list of dashboards visible to the current user in the ${jiraInstanceType}`,
  jiraToolSchemas.getDashboards,
  async ({ filter, maxResults, startAt }) => {
    const result = await jiraService.getDashboards(filter, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getDashboard",
  `Get a single dashboard by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getDashboard,
  async ({ dashboardId }) => {
    const result = await jiraService.getDashboard(dashboardId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueLinkTypes",
  `Get all issue link types available in the ${jiraInstanceType} (e.g., "Blocks", "Relates", "Duplicate")`,
  jiraToolSchemas.getIssueLinkTypes,
  async () => {
    const result = await jiraService.getIssueLinkTypes();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createIssueLinkType",
  `Create a new issue link type in the ${jiraInstanceType}`,
  jiraToolSchemas.createIssueLinkType,
  async ({ name, inward, outward }) => {
    const result = await jiraService.createIssueLinkType(name, inward, outward);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateIssueLinkType",
  `Update an issue link type in the ${jiraInstanceType}`,
  jiraToolSchemas.updateIssueLinkType,
  async ({ issueLinkTypeId, name, inward, outward }) => {
    const result = await jiraService.updateIssueLinkType(issueLinkTypeId, name, inward, outward);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteIssueLinkType",
  `Delete an issue link type from the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteIssueLinkType,
  async ({ issueLinkTypeId }) => {
    const result = await jiraService.deleteIssueLinkType(issueLinkTypeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createIssues",
  `Create multiple JIRA issues in a single bulk request in the ${jiraInstanceType}`,
  jiraToolSchemas.createIssues,
  async ({ issues }) => {
    const result = await jiraService.createIssues(issues);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_archiveIssues",
  `Bulk archive JIRA issues (by keys or JQL) in the ${jiraInstanceType}`,
  jiraToolSchemas.archiveIssues,
  async ({ issueKeysOrJql, notifyUsers }) => {
    const result = await jiraService.archiveIssues(issueKeysOrJql, notifyUsers);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_archiveIssue",
  `Archive a single JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.archiveIssue,
  async ({ issueKey, notifyUsers }) => {
    const result = await jiraService.archiveIssue(issueKey, notifyUsers);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_restoreIssue",
  `Restore a previously archived JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.restoreIssue,
  async ({ issueKey, notifyUsers }) => {
    const result = await jiraService.restoreIssue(issueKey, notifyUsers);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_rankIssues",
  `Reorder (rank) JIRA issues relative to another issue in the ${jiraInstanceType}, as used on Agile boards/backlogs`,
  jiraToolSchemas.rankIssues,
  async ({ issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId }) => {
    const result = await jiraService.rankIssues(issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssuePropertyKeys",
  `Get the keys of all entity properties stored on an issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssuePropertyKeys,
  async ({ issueKey }) => {
    const result = await jiraService.getIssuePropertyKeys(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueProperty",
  `Get a single entity property value from an issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueProperty,
  async ({ issueKey, propertyKey }) => {
    const result = await jiraService.getIssueProperty(issueKey, propertyKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setIssueProperty",
  `Set an entity property (arbitrary JSON key/value metadata) on an issue in the ${jiraInstanceType}`,
  jiraToolSchemas.setIssueProperty,
  async ({ issueKey, propertyKey, value }) => {
    const result = await jiraService.setIssueProperty(issueKey, propertyKey, value);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteIssueProperty",
  `Delete an entity property from an issue in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteIssueProperty,
  async ({ issueKey, propertyKey }) => {
    const result = await jiraService.deleteIssueProperty(issueKey, propertyKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_notifyIssue",
  `Send a manual email notification about a JIRA issue in the ${jiraInstanceType} to specific users, groups, or roles (reporter/assignee/watchers/voters)`,
  jiraToolSchemas.notifyIssue,
  async ({ issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames }) => {
    const result = await jiraService.notifyIssue(issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setCommentPinned",
  `Pin or unpin a comment on a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.setCommentPinned,
  async ({ issueKey, commentId, pinned }) => {
    const result = await jiraService.setCommentPinned(issueKey, commentId, pinned);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getPinnedComments",
  `Get all pinned comments for a JIRA issue in the ${jiraInstanceType}`,
  jiraToolSchemas.getPinnedComments,
  async ({ issueKey }) => {
    const result = await jiraService.getPinnedComments(issueKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoards",
  `Get Agile boards visible to the current user in the ${jiraInstanceType}, optionally filtered by name or project`,
  jiraToolSchemas.getBoards,
  async ({ maxResults, name, projectKeyOrId, startAt }) => {
    const result = await jiraService.getBoards(maxResults, name, projectKeyOrId, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoard",
  `Get a single Agile board by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getBoard,
  async ({ boardId }) => {
    const result = await jiraService.getBoard(boardId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardConfiguration",
  `Get the configuration (columns, estimation, ranking) of an Agile board in the ${jiraInstanceType}`,
  jiraToolSchemas.getBoardConfiguration,
  async ({ boardId }) => {
    const result = await jiraService.getBoardConfiguration(boardId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardIssues",
  `Get the issues on an Agile board in the ${jiraInstanceType}, optionally filtered by JQL`,
  jiraToolSchemas.getBoardIssues,
  async ({ boardId, jql, maxResults, startAt }) => {
    const result = await jiraService.getBoardIssues(boardId, jql, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardSprints",
  `Get the sprints of an Agile board in the ${jiraInstanceType}`,
  jiraToolSchemas.getBoardSprints,
  async ({ boardId, maxResults, startAt }) => {
    const result = await jiraService.getBoardSprints(boardId, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardVersions",
  `Get the versions of an Agile board's project in the ${jiraInstanceType}`,
  jiraToolSchemas.getBoardVersions,
  async ({ boardId, maxResults, startAt }) => {
    const result = await jiraService.getBoardVersions(boardId, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardBacklogIssues",
  `Get the backlog issues of an Agile board in the ${jiraInstanceType}`,
  jiraToolSchemas.getBoardBacklogIssues,
  async ({ boardId, jql, maxResults, startAt }) => {
    const result = await jiraService.getBoardBacklogIssues(boardId, jql, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardEpics",
  `Get the epics of an Agile board in the ${jiraInstanceType}`,
  jiraToolSchemas.getBoardEpics,
  async ({ boardId, maxResults, done, startAt }) => {
    const result = await jiraService.getBoardEpics(boardId, maxResults, done, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardIssuesWithoutEpic",
  `Get the issues on an Agile board that are not assigned to any epic, in the ${jiraInstanceType}`,
  jiraToolSchemas.getBoardIssuesWithoutEpic,
  async ({ boardId, jql, maxResults, startAt }) => {
    const result = await jiraService.getBoardIssuesWithoutEpic(boardId, jql, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getBoardEpicIssues",
  `Get the issues assigned to a specific epic on an Agile board in the ${jiraInstanceType}`,
  jiraToolSchemas.getBoardEpicIssues,
  async ({ boardId, epicId, jql, maxResults, startAt }) => {
    const result = await jiraService.getBoardEpicIssues(boardId, epicId, jql, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_moveIssuesToBacklog",
  `Move issues to the backlog in the ${jiraInstanceType}, removing them from any sprint`,
  jiraToolSchemas.moveIssuesToBacklog,
  async ({ issueKeys }) => {
    const result = await jiraService.moveIssuesToBacklog(issueKeys);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createSprint",
  `Create a sprint on an Agile board in the ${jiraInstanceType}`,
  jiraToolSchemas.createSprint,
  async ({ name, originBoardId, startDate, endDate, goal }) => {
    const result = await jiraService.createSprint(name, originBoardId, startDate, endDate, goal);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getSprint",
  `Get a single sprint by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getSprint,
  async ({ sprintId }) => {
    const result = await jiraService.getSprint(sprintId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateSprint",
  `Update a sprint in the ${jiraInstanceType}, including starting or closing it via the state field`,
  jiraToolSchemas.updateSprint,
  async ({ sprintId, name, startDate, endDate, goal, state }) => {
    const result = await jiraService.updateSprint(sprintId, name, startDate, endDate, goal, state);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteSprint",
  `Delete a sprint from the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteSprint,
  async ({ sprintId }) => {
    const result = await jiraService.deleteSprint(sprintId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getSprintIssues",
  `Get the issues in a sprint in the ${jiraInstanceType}`,
  jiraToolSchemas.getSprintIssues,
  async ({ sprintId, jql, maxResults, startAt }) => {
    const result = await jiraService.getSprintIssues(sprintId, jql, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_moveIssuesToSprint",
  `Move issues into a sprint in the ${jiraInstanceType}`,
  jiraToolSchemas.moveIssuesToSprint,
  async ({ sprintId, issueKeys }) => {
    const result = await jiraService.moveIssuesToSprint(sprintId, issueKeys);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getEpic",
  `Get a single epic by id or issue key from the ${jiraInstanceType}`,
  jiraToolSchemas.getEpic,
  async ({ epicIdOrKey }) => {
    const result = await jiraService.getEpic(epicIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateEpic",
  `Update an epic (name, summary, done status) in the ${jiraInstanceType}`,
  jiraToolSchemas.updateEpic,
  async ({ epicIdOrKey, name, summary, done }) => {
    const result = await jiraService.updateEpic(epicIdOrKey, name, summary, done);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getEpicIssues",
  `Get the issues assigned to an epic in the ${jiraInstanceType}`,
  jiraToolSchemas.getEpicIssues,
  async ({ epicIdOrKey, jql, maxResults, startAt }) => {
    const result = await jiraService.getEpicIssues(epicIdOrKey, jql, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_moveIssuesToEpic",
  `Move issues into an epic in the ${jiraInstanceType}`,
  jiraToolSchemas.moveIssuesToEpic,
  async ({ epicIdOrKey, issueKeys }) => {
    const result = await jiraService.moveIssuesToEpic(epicIdOrKey, issueKeys);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_rankEpic",
  `Reorder (rank) an epic relative to another epic in the ${jiraInstanceType}`,
  jiraToolSchemas.rankEpic,
  async ({ epicIdOrKey, rankBeforeEpic, rankAfterEpic, rankCustomFieldId }) => {
    const result = await jiraService.rankEpic(epicIdOrKey, rankBeforeEpic, rankAfterEpic, rankCustomFieldId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueTypeSchemes",
  `Get all issue type schemes visible to the user in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueTypeSchemes,
  async () => {
    const result = await jiraService.getIssueTypeSchemes();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createIssueTypeScheme",
  `Create a new issue type scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.createIssueTypeScheme,
  async ({ name, description, issueTypeIds, defaultIssueTypeId }) => {
    const result = await jiraService.createIssueTypeScheme(name, description, issueTypeIds, defaultIssueTypeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueTypeScheme",
  `Get a single issue type scheme by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueTypeScheme,
  async ({ schemeId }) => {
    const result = await jiraService.getIssueTypeScheme(schemeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateIssueTypeScheme",
  `Update an issue type scheme's name, description, or issue types in the ${jiraInstanceType}`,
  jiraToolSchemas.updateIssueTypeScheme,
  async ({ schemeId, name, description, issueTypeIds, defaultIssueTypeId }) => {
    const result = await jiraService.updateIssueTypeScheme(schemeId, name, description, issueTypeIds, defaultIssueTypeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteIssueTypeScheme",
  `Delete an issue type scheme in the ${jiraInstanceType}. Associated projects fall back to the default scheme.`,
  jiraToolSchemas.deleteIssueTypeScheme,
  async ({ schemeId }) => {
    const result = await jiraService.deleteIssueTypeScheme(schemeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueTypeSchemeProjects",
  `Get the projects associated with an issue type scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueTypeSchemeProjects,
  async ({ schemeId, expand }) => {
    const result = await jiraService.getIssueTypeSchemeProjects(schemeId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setIssueTypeSchemeProjects",
  `Replace the project associations of an issue type scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.setIssueTypeSchemeProjects,
  async ({ schemeId, idsOrKeys }) => {
    const result = await jiraService.setIssueTypeSchemeProjects(schemeId, idsOrKeys);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addIssueTypeSchemeProjects",
  `Add project associations to an issue type scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.addIssueTypeSchemeProjects,
  async ({ schemeId, idsOrKeys }) => {
    const result = await jiraService.addIssueTypeSchemeProjects(schemeId, idsOrKeys);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_removeIssueTypeSchemeProjects",
  `Remove all project associations from an issue type scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.removeIssueTypeSchemeProjects,
  async ({ schemeId }) => {
    const result = await jiraService.removeIssueTypeSchemeProjects(schemeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_removeIssueTypeSchemeProject",
  `Remove a single project association from an issue type scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.removeIssueTypeSchemeProject,
  async ({ schemeId, projIdOrKey }) => {
    const result = await jiraService.removeIssueTypeSchemeProject(schemeId, projIdOrKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getPrioritySchemes",
  `Get all priority schemes in the ${jiraInstanceType}`,
  jiraToolSchemas.getPrioritySchemes,
  async ({ maxResults, startAt }) => {
    const result = await jiraService.getPrioritySchemes(maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createPriorityScheme",
  `Create a new priority scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.createPriorityScheme,
  async ({ name, description, defaultOptionId, optionIds }) => {
    const result = await jiraService.createPriorityScheme(name, description, defaultOptionId, optionIds);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getPriorityScheme",
  `Get a single priority scheme by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getPriorityScheme,
  async ({ schemeId }) => {
    const result = await jiraService.getPriorityScheme(schemeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updatePriorityScheme",
  `Update a priority scheme's name, description, or priorities in the ${jiraInstanceType}`,
  jiraToolSchemas.updatePriorityScheme,
  async ({ schemeId, name, description, defaultOptionId, optionIds }) => {
    const result = await jiraService.updatePriorityScheme(schemeId, name, description, defaultOptionId, optionIds);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deletePriorityScheme",
  `Delete a priority scheme in the ${jiraInstanceType}. Projects using it fall back to the default priority scheme.`,
  jiraToolSchemas.deletePriorityScheme,
  async ({ schemeId }) => {
    const result = await jiraService.deletePriorityScheme(schemeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectCategories",
  `Get all project categories in the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectCategories,
  async () => {
    const result = await jiraService.getProjectCategories();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createProjectCategory",
  `Create a new project category in the ${jiraInstanceType}`,
  jiraToolSchemas.createProjectCategory,
  async ({ name, description }) => {
    const result = await jiraService.createProjectCategory(name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getProjectCategory",
  `Get a single project category by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getProjectCategory,
  async ({ id }) => {
    const result = await jiraService.getProjectCategory(id);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateProjectCategory",
  `Update a project category's name or description in the ${jiraInstanceType}`,
  jiraToolSchemas.updateProjectCategory,
  async ({ id, name, description }) => {
    const result = await jiraService.updateProjectCategory(id, name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteProjectCategory",
  `Delete a project category in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteProjectCategory,
  async ({ id }) => {
    const result = await jiraService.deleteProjectCategory(id);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getRoleDefinitions",
  `Get all global role definitions available in the ${jiraInstanceType}. This is the global role catalog, distinct from jira_getProjectRoles which returns roles for a specific project.`,
  jiraToolSchemas.getRoleDefinitions,
  async () => {
    const result = await jiraService.getRoleDefinitions();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createRoleDefinition",
  `Create a new global role definition in the ${jiraInstanceType}. The created role has no default actors assigned.`,
  jiraToolSchemas.createRoleDefinition,
  async ({ name, description }) => {
    const result = await jiraService.createRoleDefinition(name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getRoleDefinition",
  `Get a single global role definition by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getRoleDefinition,
  async ({ id }) => {
    const result = await jiraService.getRoleDefinition(id);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateRoleDefinition",
  `Fully update a global role definition's name and description in the ${jiraInstanceType}. Both fields must be given.`,
  jiraToolSchemas.updateRoleDefinition,
  async ({ id, name, description }) => {
    const result = await jiraService.updateRoleDefinition(id, name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_partialUpdateRoleDefinition",
  `Partially update a global role definition's name or description in the ${jiraInstanceType}`,
  jiraToolSchemas.partialUpdateRoleDefinition,
  async ({ id, name, description }) => {
    const result = await jiraService.partialUpdateRoleDefinition(id, name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteRoleDefinition",
  `Delete a global role definition in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteRoleDefinition,
  async ({ id, swap }) => {
    const result = await jiraService.deleteRoleDefinition(id, swap);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getRoleDefinitionActors",
  `Get the default actors for a global role definition in the ${jiraInstanceType}`,
  jiraToolSchemas.getRoleDefinitionActors,
  async ({ id }) => {
    const result = await jiraService.getRoleDefinitionActors(id);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addRoleDefinitionActors",
  `Add default actors to a global role definition in the ${jiraInstanceType}`,
  jiraToolSchemas.addRoleDefinitionActors,
  async ({ id, users, groups }) => {
    const result = await jiraService.addRoleDefinitionActors(id, users, groups);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteRoleDefinitionActor",
  `Remove a default actor from a global role definition in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteRoleDefinitionActor,
  async ({ id, user, group }) => {
    const result = await jiraService.deleteRoleDefinitionActor(id, user, group);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getPermissionSchemes",
  `Get all permission schemes in the ${jiraInstanceType}`,
  jiraToolSchemas.getPermissionSchemes,
  async ({ expand }) => {
    const result = await jiraService.getPermissionSchemes(expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getPermissionScheme",
  `Get a single permission scheme by id from the ${jiraInstanceType}`,
  jiraToolSchemas.getPermissionScheme,
  async ({ schemeId, expand }) => {
    const result = await jiraService.getPermissionScheme(schemeId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createPermissionScheme",
  `Create a new permission scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.createPermissionScheme,
  async ({ name, description, permissions }) => {
    const result = await jiraService.createPermissionScheme(name, description, permissions);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updatePermissionScheme",
  `Update a permission scheme's name, description, or permission grants in the ${jiraInstanceType}`,
  jiraToolSchemas.updatePermissionScheme,
  async ({ schemeId, name, description, permissions }) => {
    const result = await jiraService.updatePermissionScheme(schemeId, name, description, permissions);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deletePermissionScheme",
  `Delete a permission scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.deletePermissionScheme,
  async ({ schemeId }) => {
    const result = await jiraService.deletePermissionScheme(schemeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getPermissionSchemeGrants",
  `Get all permission grants of a permission scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.getPermissionSchemeGrants,
  async ({ schemeId, expand }) => {
    const result = await jiraService.getPermissionSchemeGrants(schemeId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createPermissionGrant",
  `Create a permission grant in a permission scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.createPermissionGrant,
  async ({ schemeId, permission, holderType, holderParameter }) => {
    const result = await jiraService.createPermissionGrant(schemeId, permission, holderType, holderParameter);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deletePermissionGrant",
  `Delete a permission grant from a permission scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.deletePermissionGrant,
  async ({ schemeId, permissionId }) => {
    const result = await jiraService.deletePermissionGrant(schemeId, permissionId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getApplicationRoles",
  `Get all application roles (e.g. jira-software, jira-servicedesk) in the ${jiraInstanceType}. Read-only catalog of licensed applications.`,
  jiraToolSchemas.getApplicationRoles,
  async () => {
    const result = await jiraService.getApplicationRoles();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getApplicationRole",
  `Get a single application role by key from the ${jiraInstanceType}. Use jira_getApplicationRoles to find valid keys.`,
  jiraToolSchemas.getApplicationRole,
  async ({ key }) => {
    const result = await jiraService.getApplicationRole(key);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getWorkflows",
  `Get all workflows (or a workflow by name) in the ${jiraInstanceType}`,
  jiraToolSchemas.getWorkflows,
  async ({ workflowName }) => {
    const result = await jiraService.getWorkflows(workflowName);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getWorkflowScheme",
  `Get a workflow scheme by id in the ${jiraInstanceType}`,
  jiraToolSchemas.getWorkflowScheme,
  async ({ schemeId, returnDraftIfExists }) => {
    const result = await jiraService.getWorkflowScheme(schemeId, returnDraftIfExists);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getWorkflowSchemeDefault",
  `Get the default workflow of a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.getWorkflowSchemeDefault,
  async ({ schemeId, returnDraftIfExists }) => {
    const result = await jiraService.getWorkflowSchemeDefault(schemeId, returnDraftIfExists);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getWorkflowSchemeIssueTypeMapping",
  `Get the workflow mapping for a specific issue type in a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.getWorkflowSchemeIssueTypeMapping,
  async ({ schemeId, issueType, returnDraftIfExists }) => {
    const result = await jiraService.getWorkflowSchemeIssueTypeMapping(schemeId, issueType, returnDraftIfExists);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getWorkflowSchemeWorkflowMapping",
  `Get the issue type mappings for a workflow (or all workflows) in a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.getWorkflowSchemeWorkflowMapping,
  async ({ schemeId, workflowName, returnDraftIfExists }) => {
    const result = await jiraService.getWorkflowSchemeWorkflowMapping(schemeId, workflowName, returnDraftIfExists);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createWorkflowScheme",
  `Create a new workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.createWorkflowScheme,
  async ({ name, description, defaultWorkflow, issueTypeMappings }) => {
    const result = await jiraService.createWorkflowScheme(name, description, defaultWorkflow, issueTypeMappings);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateWorkflowScheme",
  `Update a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.updateWorkflowScheme,
  async ({ schemeId, name, description, defaultWorkflow, issueTypeMappings, updateDraftIfNeeded }) => {
    const result = await jiraService.updateWorkflowScheme(schemeId, name, description, defaultWorkflow, issueTypeMappings, updateDraftIfNeeded);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteWorkflowScheme",
  `Delete a workflow scheme in the ${jiraInstanceType}. This is irreversible.`,
  jiraToolSchemas.deleteWorkflowScheme,
  async ({ schemeId }) => {
    const result = await jiraService.deleteWorkflowScheme(schemeId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setWorkflowSchemeIssueTypeMapping",
  `Set the workflow mapping for a specific issue type in a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.setWorkflowSchemeIssueTypeMapping,
  async ({ schemeId, issueType, workflow, updateDraftIfNeeded }) => {
    const result = await jiraService.setWorkflowSchemeIssueTypeMapping(schemeId, issueType, workflow, updateDraftIfNeeded);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteWorkflowSchemeIssueTypeMapping",
  `Remove an issue type's workflow mapping from a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteWorkflowSchemeIssueTypeMapping,
  async ({ schemeId, issueType, updateDraftIfNeeded }) => {
    const result = await jiraService.deleteWorkflowSchemeIssueTypeMapping(schemeId, issueType, updateDraftIfNeeded);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setWorkflowSchemeWorkflowMapping",
  `Set (add or replace) a workflow's issue type mapping in a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.setWorkflowSchemeWorkflowMapping,
  async ({ schemeId, workflow, issueTypes, defaultMapping, workflowName, updateDraftIfNeeded }) => {
    const result = await jiraService.setWorkflowSchemeWorkflowMapping(schemeId, workflow, issueTypes, defaultMapping, updateDraftIfNeeded, workflowName);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteWorkflowSchemeWorkflowMapping",
  `Remove a workflow's mapping from a workflow scheme in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteWorkflowSchemeWorkflowMapping,
  async ({ schemeId, workflowName, updateDraftIfNeeded }) => {
    const result = await jiraService.deleteWorkflowSchemeWorkflowMapping(schemeId, workflowName, updateDraftIfNeeded);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getNotificationSchemes",
  `Get a paginated list of notification schemes in the ${jiraInstanceType}`,
  jiraToolSchemas.getNotificationSchemes,
  async ({ expand, maxResults, startAt }) => {
    const result = await jiraService.getNotificationSchemes(expand, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getNotificationScheme",
  `Get full details of a notification scheme by id in the ${jiraInstanceType}`,
  jiraToolSchemas.getNotificationScheme,
  async ({ id, expand }) => {
    const result = await jiraService.getNotificationScheme(id, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getSecurityLevel",
  `Get an issue security level by id in the ${jiraInstanceType}`,
  jiraToolSchemas.getSecurityLevel,
  async ({ id }) => {
    const result = await jiraService.getSecurityLevel(id);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueSecuritySchemes",
  `Get all issue security schemes in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueSecuritySchemes,
  async () => {
    const result = await jiraService.getIssueSecuritySchemes();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getIssueSecurityScheme",
  `Get an issue security scheme by id in the ${jiraInstanceType}`,
  jiraToolSchemas.getIssueSecurityScheme,
  async ({ id }) => {
    const result = await jiraService.getIssueSecurityScheme(id);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getCustomFields",
  `Get a paginated, filterable list of custom fields in the ${jiraInstanceType}`,
  jiraToolSchemas.getCustomFields,
  async ({ sortColumn, types, search, maxResults, sortOrder, screenIds, lastValueUpdate, projectIds, startAt }) => {
    const result = await jiraService.getCustomFields(sortColumn, types, search, maxResults, sortOrder, screenIds, lastValueUpdate, projectIds, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteCustomFields",
  `Delete custom fields in bulk in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteCustomFields,
  async ({ ids }) => {
    const result = await jiraService.deleteCustomFields(ids);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getCustomFieldOptions",
  `Get a custom field's options defined in a given context of projects and issue types in the ${jiraInstanceType}`,
  jiraToolSchemas.getCustomFieldOptions,
  async ({ customFieldId, maxResults, issueTypeIds, query, sortByOptionName, useAllContexts, page, projectIds }) => {
    const result = await jiraService.getCustomFieldOptions(customFieldId, maxResults, issueTypeIds, query, sortByOptionName, useAllContexts, page, projectIds);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getCustomFieldOption",
  `Get a custom field option by id in the ${jiraInstanceType}`,
  jiraToolSchemas.getCustomFieldOption,
  async ({ id }) => {
    const result = await jiraService.getCustomFieldOption(id);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createCustomField",
  `Create a new custom field in the ${jiraInstanceType}`,
  jiraToolSchemas.createCustomField,
  async ({ name, type, description, searcherKey, issueTypeIds, projectIds }) => {
    const result = await jiraService.createCustomField(name, type, description, searcherKey, issueTypeIds, projectIds);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createUser",
  `Create a new user in the ${jiraInstanceType}`,
  jiraToolSchemas.createUser,
  async ({ name, emailAddress, displayName, password, notification }) => {
    const result = await jiraService.createUser(name, emailAddress, displayName, password, notification);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_removeUser",
  `Remove a user and its references in the ${jiraInstanceType}`,
  jiraToolSchemas.removeUser,
  async ({ key, username }) => {
    const result = await jiraService.removeUser(key, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_changeUserPassword",
  `Change a user's password in the ${jiraInstanceType}`,
  jiraToolSchemas.changeUserPassword,
  async ({ password, currentPassword, key, username }) => {
    const result = await jiraService.changeUserPassword(password, currentPassword, key, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_validateUserAnonymization",
  `Validate whether a user can be anonymized in the ${jiraInstanceType}`,
  jiraToolSchemas.validateUserAnonymization,
  async ({ userKey, expand }) => {
    const result = await jiraService.validateUserAnonymization(userKey, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_scheduleUserAnonymization",
  `Schedule a user anonymization process in the ${jiraInstanceType}. Requires system admin permission.`,
  jiraToolSchemas.scheduleUserAnonymization,
  async ({ userKey, newOwnerKey }) => {
    const result = await jiraService.scheduleUserAnonymization(userKey, newOwnerKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getUserAnonymizationProgress",
  `Get the progress of a user anonymization task in the ${jiraInstanceType}`,
  jiraToolSchemas.getUserAnonymizationProgress,
  async ({ taskId }) => {
    const result = await jiraService.getUserAnonymizationProgress(taskId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getSystemAvatars",
  `Get all system avatars of a given type in the ${jiraInstanceType}`,
  jiraToolSchemas.getSystemAvatars,
  async ({ type }) => {
    const result = await jiraService.getSystemAvatars(type);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getAvatars",
  `Get all avatars (system and custom) for a given type and owner in the ${jiraInstanceType}`,
  jiraToolSchemas.getAvatars,
  async ({ type, owningObjectId }) => {
    const result = await jiraService.getAvatars(type, owningObjectId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_uploadTemporaryAvatar",
  `Upload a temporary avatar image in the ${jiraInstanceType}. Returns cropping instructions to pass to jira_createAvatarFromTemporary.`,
  jiraToolSchemas.uploadTemporaryAvatar,
  async ({ type, owningObjectId, fileName, contentBase64 }) => {
    const result = await jiraService.uploadTemporaryAvatar(type, owningObjectId, fileName, contentBase64);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_createAvatarFromTemporary",
  `Finalize a temporary avatar into a real avatar in the ${jiraInstanceType}, using the cropping instructions from jira_uploadTemporaryAvatar.`,
  jiraToolSchemas.createAvatarFromTemporary,
  async ({ type, owningObjectId, cropperOffsetX, cropperOffsetY, cropperWidth, needsCropping, url }) => {
    const result = await jiraService.createAvatarFromTemporary(type, owningObjectId, cropperOffsetX, cropperOffsetY, cropperWidth, needsCropping, url);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteAvatar",
  `Delete an avatar by id in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteAvatar,
  async ({ id, type, owningObjectId }) => {
    const result = await jiraService.deleteAvatar(id, type, owningObjectId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getMyPermissions",
  `Get the permissions the currently logged in user has in the ${jiraInstanceType}, optionally scoped to a project or issue`,
  jiraToolSchemas.getMyPermissions,
  async ({ projectKey, projectId, issueKey, issueId }) => {
    const result = await jiraService.getMyPermissions(projectKey, projectId, issueKey, issueId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getAllPermissions",
  `Get the full catalog of permission types present in the ${jiraInstanceType} — global, project, and plugin-added`,
  jiraToolSchemas.getAllPermissions,
  async () => {
    const result = await jiraService.getAllPermissions();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getJqlAutocompleteData",
  `Get the reserved words, visible field names, and function names available for building JQL queries in the ${jiraInstanceType}`,
  jiraToolSchemas.getJqlAutocompleteData,
  async () => {
    const result = await jiraService.getJqlAutocompleteData();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getJqlFieldAutocomplete",
  `Get value autocomplete suggestions for a JQL field while building a query in the ${jiraInstanceType}. Useful before calling jira_searchIssues to discover valid field values.`,
  jiraToolSchemas.getJqlFieldAutocomplete,
  async ({ fieldName, fieldValue, predicateName, predicateValue }) => {
    const result = await jiraService.getJqlFieldAutocomplete(fieldName, fieldValue, predicateName, predicateValue);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_validateProjectKey",
  `Validate a candidate project key in the ${jiraInstanceType} before creating a new project. Returns any validation errors; an empty result means the key is valid.`,
  jiraToolSchemas.validateProjectKey,
  async ({ key }) => {
    const result = await jiraService.validateProjectKey(key);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getMyPreference",
  `Get a preference value for the current user by key in the ${jiraInstanceType}`,
  jiraToolSchemas.getMyPreference,
  async ({ key }) => {
    const result = await jiraService.getMyPreference(key);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setMyPreference",
  `Set a preference value for the current user by key in the ${jiraInstanceType}`,
  jiraToolSchemas.setMyPreference,
  async ({ key, value }) => {
    const result = await jiraService.setMyPreference(key, value);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteMyPreference",
  `Remove a preference value for the current user by key in the ${jiraInstanceType}`,
  jiraToolSchemas.deleteMyPreference,
  async ({ key }) => {
    const result = await jiraService.deleteMyPreference(key);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getAllScreens",
  `Get a paginated, searchable list of field screens in the ${jiraInstanceType}`,
  jiraToolSchemas.getAllScreens,
  async ({ search, expand, maxResults, startAt }) => {
    const result = await jiraService.getAllScreens(search, expand, maxResults, startAt);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addFieldToDefaultScreen",
  `Add a field or custom field to the default screen's default tab in the ${jiraInstanceType}`,
  jiraToolSchemas.addFieldToDefaultScreen,
  async ({ fieldId }) => {
    const result = await jiraService.addFieldToDefaultScreen(fieldId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getScreenAvailableFields",
  `Get fields available to add to a screen (ones not already present on any tab) in the ${jiraInstanceType}`,
  jiraToolSchemas.getScreenAvailableFields,
  async ({ screenId }) => {
    const result = await jiraService.getScreenAvailableFields(screenId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getScreenTabs",
  `Get all tabs for a screen in the ${jiraInstanceType}`,
  jiraToolSchemas.getScreenTabs,
  async ({ screenId, projectKey }) => {
    const result = await jiraService.getScreenTabs(screenId, projectKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addScreenTab",
  `Add a new tab to a screen in the ${jiraInstanceType}`,
  jiraToolSchemas.addScreenTab,
  async ({ screenId, name }) => {
    const result = await jiraService.addScreenTab(screenId, name);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_renameScreenTab",
  `Rename a tab on a screen in the ${jiraInstanceType}`,
  jiraToolSchemas.renameScreenTab,
  async ({ screenId, tabId, name }) => {
    const result = await jiraService.renameScreenTab(screenId, tabId, name);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_deleteScreenTab",
  `Delete a tab from a screen in the ${jiraInstanceType}. The screen must have at least one tab remaining.`,
  jiraToolSchemas.deleteScreenTab,
  async ({ screenId, tabId }) => {
    const result = await jiraService.deleteScreenTab(screenId, tabId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_moveScreenTab",
  `Move a tab to a new position on a screen in the ${jiraInstanceType}`,
  jiraToolSchemas.moveScreenTab,
  async ({ screenId, tabId, pos }) => {
    const result = await jiraService.moveScreenTab(screenId, tabId, pos);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getScreenTabFields",
  `Get all fields on a screen tab in the ${jiraInstanceType}`,
  jiraToolSchemas.getScreenTabFields,
  async ({ screenId, tabId, projectKey }) => {
    const result = await jiraService.getScreenTabFields(screenId, tabId, projectKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_addFieldToScreenTab",
  `Add a field to a screen tab in the ${jiraInstanceType}`,
  jiraToolSchemas.addFieldToScreenTab,
  async ({ screenId, tabId, fieldId }) => {
    const result = await jiraService.addFieldToScreenTab(screenId, tabId, fieldId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_removeFieldFromScreenTab",
  `Remove a field from a screen tab in the ${jiraInstanceType}`,
  jiraToolSchemas.removeFieldFromScreenTab,
  async ({ screenId, tabId, fieldId }) => {
    const result = await jiraService.removeFieldFromScreenTab(screenId, tabId, fieldId);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_moveScreenTabField",
  `Move a field's position on a screen tab in the ${jiraInstanceType}`,
  jiraToolSchemas.moveScreenTabField,
  async ({ screenId, tabId, fieldId, after, position }) => {
    const result = await jiraService.moveScreenTabField(screenId, tabId, fieldId, after, position);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_updateScreenTabFieldShowWhenEmpty",
  `Update whether a field on a screen tab shows a 'no value' indicator when empty in the ${jiraInstanceType}`,
  jiraToolSchemas.updateScreenTabFieldShowWhenEmpty,
  async ({ screenId, tabId, fieldId, showWhenEmpty }) => {
    const result = await jiraService.updateScreenTabFieldShowWhenEmpty(screenId, tabId, fieldId, showWhenEmpty);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getServerInfo",
  `Get general information about the current ${jiraInstanceType} server, including version, build number, and deployment type`,
  jiraToolSchemas.getServerInfo,
  async () => {
    const result = await jiraService.getServerInfo();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_validateLicense",
  `Validate a license string against the current ${jiraInstanceType} server installation`,
  jiraToolSchemas.validateLicense,
  async ({ licenseString }) => {
    const result = await jiraService.validateLicense(licenseString);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getApplicationProperty",
  `Get an application property by key from the ${jiraInstanceType}`,
  jiraToolSchemas.getApplicationProperty,
  async ({ permissionLevel, key, keyFilter }) => {
    const result = await jiraService.getApplicationProperty(permissionLevel, key, keyFilter);
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_getAdvancedSettings",
  `Get all advanced settings application properties (General Configuration > Advanced Settings) in the ${jiraInstanceType}`,
  jiraToolSchemas.getAdvancedSettings,
  async () => {
    const result = await jiraService.getAdvancedSettings();
    return formatToolResponse(result);
  }
);

server.tool(
  "jira_setApplicationProperty",
  `Update an application property's value in the ${jiraInstanceType}`,
  jiraToolSchemas.setApplicationProperty,
  async ({ id, value }) => {
    const result = await jiraService.setApplicationProperty(id, value);
    return formatToolResponse(result);
  }
);

server.registerResource(
  "jira-issue",
  new ResourceTemplate("jira://issue/{issueKey}", { list: undefined }),
  {
    title: "Jira issue",
    description: `An issue in the ${jiraInstanceType}, addressable by its key (e.g. jira://issue/PROJ-123).`,
    mimeType: "application/json",
  },
  async (uri, { issueKey }) => {
    const result = await jiraService.getIssue(firstValue(issueKey));
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(result),
        },
      ],
    };
  }
);

server.registerPrompt(
  "jira_triageIssue",
  {
    title: "Triage a Jira issue",
    description: `Guides triaging a single issue in the ${jiraInstanceType}: gather its details, comments, and available transitions, then recommend a priority, assignee, and next status.`,
    argsSchema: {
      issueKey: z.string().describe("The issue key to triage, e.g. PROJ-123"),
    },
  },
  ({ issueKey }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Triage Jira issue ${issueKey}.

1. Call jira_getIssue for ${issueKey} to read its summary, description, status, priority, and assignee.
2. Call jira_getIssueComments for ${issueKey} to check for prior discussion or blockers.
3. Call jira_getTransitions for ${issueKey} to see what statuses it can move to next.
4. Summarize what the issue is about, its current state, and anything blocking it.
5. Recommend a priority (with reasoning), whether it needs reassignment, and which transition (if any) it should move to next.

This is a read-only triage — do not call jira_transitionIssue, jira_updateIssue, or jira_assignIssue until the recommendation has been confirmed.`,
        },
      },
    ],
  })
);

await connectServer(server);
