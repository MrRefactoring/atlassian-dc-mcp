import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerIssueTools(server: McpServer, service: JiraService) {
  server.registerTool(
    'jira_searchIssues',
    {
      description: `Search for JIRA issues using JQL in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.searchIssues,
    },
    async ({ jql, expand, startAt, maxResults, fields }) => {
      const result = await service.searchIssues(jql, startAt, expand, maxResults, fields);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssue',
    {
      description: `Get details of a JIRA issue by its key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssue,
    },
    async ({ issueKey, expand, fields }) => {
      const result = await service.getIssue(issueKey, expand, fields);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueComments',
    {
      description: `Get comments of a JIRA issue by its key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueComments,
    },
    async ({ issueKey, expand, maxResults, startAt }) => {
      const result = await service.getIssueComments(issueKey, expand, maxResults, startAt);

      return formatToolResponse(result);
    });

  server.registerTool(
    'jira_createIssue',
    {
      description: `Create a new JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIssue,
    },
    async (params) => {
      const result = await service.createIssue(params);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateIssue',
    {
      description: `Update an existing JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssue,
    },
    async (params) => {
      const result = await service.updateIssue(params);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_postIssueComment',
    {
      description: `Post a comment on a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.postIssueComment,
    },
    async ({ issueKey, comment }) => {
      const result = await service.postIssueComment(issueKey, comment);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getTransitions',
    {
      description: `Get available status transitions for a JIRA issue in the ${jiraInstanceType}. Returns a list of transitions with their IDs, names, and target statuses.`,
      inputSchema: jiraToolSchemas.getTransitions,
    },
    async ({ issueKey }) => {
      const result = await service.getTransitions(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueDevelopmentInfo',
    {
      description: `Get linked development information (pull requests, commits, or branches) shown in the Development panel of a JIRA issue in the ${jiraInstanceType}. Defaults to pull requests from Bitbucket.`,
      inputSchema: jiraToolSchemas.getIssueDevelopmentInfo,
    },
    async ({ issueKey, dataType, applicationType }) => {
      const result = await service.getIssueDevelopmentInfo(issueKey, dataType, applicationType);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_transitionIssue',
    {
      description: `Transition a JIRA issue to a new status in the ${jiraInstanceType}. Use jira_getTransitions first to get available transition IDs.`,
      inputSchema: jiraToolSchemas.transitionIssue,
    },
    async (params) => {
      const result = await service.transitionIssue(params);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueTypes',
    {
      description: `Get all issue types available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueTypes,
    },
    async () => {
      const result = await service.getIssueTypes();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getPriorities',
    {
      description: `Get all issue priorities available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPriorities,
    },
    async () => {
      const result = await service.getPriorities();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getResolutions',
    {
      description: `Get all issue resolutions available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getResolutions,
    },
    async () => {
      const result = await service.getResolutions();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getStatuses',
    {
      description: `Get all issue statuses available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getStatuses,
    },
    async () => {
      const result = await service.getStatuses();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCreateIssueMetaIssueTypes',
    {
      description: `Get the issue types available for creating an issue in a project, in the ${jiraInstanceType}. Use before jira_createIssue to find a valid issueTypeId.`,
      inputSchema: jiraToolSchemas.getCreateIssueMetaIssueTypes,
    },
    async ({ projectIdOrKey, maxResults, startAt }) => {
      const result = await service.getCreateIssueMetaIssueTypes(projectIdOrKey, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCreateIssueMetaFields',
    {
      description: `Get the fields (required and optional) available for creating an issue of a given type in a project, in the ${jiraInstanceType}. Use before jira_createIssue to discover required fields.`,
      inputSchema: jiraToolSchemas.getCreateIssueMetaFields,
    },
    async ({ projectIdOrKey, issueTypeId, maxResults, startAt }) => {
      const result = await service.getCreateIssueMetaFields(projectIdOrKey, issueTypeId, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getEditIssueMeta',
    {
      description: `Get the fields available for editing an existing issue, in the ${jiraInstanceType}. Use before jira_updateIssue to discover which fields can be edited.`,
      inputSchema: jiraToolSchemas.getEditIssueMeta,
    },
    async ({ issueKey }) => {
      const result = await service.getEditIssueMeta(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteIssue',
    {
      description: `Delete a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssue,
    },
    async ({ issueKey, deleteSubtasks }) => {
      const result = await service.deleteIssue(issueKey, deleteSubtasks);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateIssueComment',
    {
      description: `Update the text of an existing comment on a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssueComment,
    },
    async ({ issueKey, commentId, comment }) => {
      const result = await service.updateIssueComment(issueKey, commentId, comment);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteIssueComment',
    {
      description: `Delete a comment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueComment,
    },
    async ({ issueKey, commentId }) => {
      const result = await service.deleteIssueComment(issueKey, commentId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCommentPropertyKeys',
    {
      description: `Get the keys of all entity properties stored on a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCommentPropertyKeys,
    },
    async ({ commentId }) => {
      const result = await service.getCommentPropertyKeys(commentId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getCommentProperty',
    {
      description: `Get a single entity property value from a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCommentProperty,
    },
    async ({ commentId, propertyKey }) => {
      const result = await service.getCommentProperty(commentId, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_setCommentProperty',
    {
      description: `Set an entity property (arbitrary JSON key/value metadata) on a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setCommentProperty,
    },
    async ({ commentId, propertyKey, value }) => {
      const result = await service.setCommentProperty(commentId, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteCommentProperty',
    {
      description: `Delete an entity property from a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteCommentProperty,
    },
    async ({ commentId, propertyKey }) => {
      const result = await service.deleteCommentProperty(commentId, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueWatchers',
    {
      description: `Get the list of users watching a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueWatchers,
    },
    async ({ issueKey }) => {
      const result = await service.getIssueWatchers(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_addIssueWatcher',
    {
      description: `Add a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addIssueWatcher,
    },
    async ({ issueKey, username }) => {
      const result = await service.addIssueWatcher(issueKey, username);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_removeIssueWatcher',
    {
      description: `Remove a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeIssueWatcher,
    },
    async ({ issueKey, username }) => {
      const result = await service.removeIssueWatcher(issueKey, username);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueVotes',
    {
      description: `Get vote information for a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueVotes,
    },
    async ({ issueKey }) => {
      const result = await service.getIssueVotes(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_addIssueVote',
    {
      description: `Cast a vote for a JIRA issue in the ${jiraInstanceType} (as the current user)`,
      inputSchema: jiraToolSchemas.addIssueVote,
    },
    async ({ issueKey }) => {
      const result = await service.addIssueVote(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_removeIssueVote',
    {
      description: `Remove the current user's vote from a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeIssueVote,
    },
    async ({ issueKey }) => {
      const result = await service.removeIssueVote(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueWorklogs',
    {
      description: `Get all worklog entries of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueWorklogs,
    },
    async ({ issueKey }) => {
      const result = await service.getIssueWorklogs(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_addIssueWorklog',
    {
      description: `Add a worklog entry (time tracking) to a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addIssueWorklog,
    },
    async ({ issueKey, timeSpent, comment, started }) => {
      const result = await service.addIssueWorklog(issueKey, timeSpent, comment, started);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueWorklog',
    {
      description: `Get a single worklog entry of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueWorklog,
    },
    async ({ issueKey, worklogId }) => {
      const result = await service.getIssueWorklog(issueKey, worklogId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateIssueWorklog',
    {
      description: `Update a worklog entry of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssueWorklog,
    },
    async ({ issueKey, worklogId, timeSpent, comment, started }) => {
      const result = await service.updateIssueWorklog(issueKey, worklogId, timeSpent, comment, started);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteIssueWorklog',
    {
      description: `Delete a worklog entry from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueWorklog,
    },
    async ({ issueKey, worklogId }) => {
      const result = await service.deleteIssueWorklog(issueKey, worklogId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getWorklogsDeletedSince',
    {
      description: `Get the ids of worklogs deleted since a given time across the whole ${jiraInstanceType}, for bulk sync`,
      inputSchema: jiraToolSchemas.getWorklogsDeletedSince,
    },
    async ({ since }) => {
      const result = await service.getWorklogsDeletedSince(since);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getWorklogsModifiedSince',
    {
      description: `Get the ids of worklogs modified since a given time across the whole ${jiraInstanceType}, for bulk sync`,
      inputSchema: jiraToolSchemas.getWorklogsModifiedSince,
    },
    async ({ since }) => {
      const result = await service.getWorklogsModifiedSince(since);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getWorklogsForIds',
    {
      description: `Get worklog details for a batch of worklog ids in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getWorklogsForIds,
    },
    async ({ worklogIds }) => {
      const result = await service.getWorklogsForIds(worklogIds);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_addIssueAttachment',
    {
      description: `Attach a file to a JIRA issue in the ${jiraInstanceType}. Provide file content as base64.`,
      inputSchema: jiraToolSchemas.addIssueAttachment,
    },
    async ({ issueKey, fileName, contentBase64 }) => {
      const result = await service.addIssueAttachment(issueKey, fileName, contentBase64);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getAttachmentMeta',
    {
      description: `Get attachment capabilities (enabled/disabled, max upload size) of the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getAttachmentMeta,
    },
    async () => {
      const result = await service.getAttachmentMeta();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getAttachment',
    {
      description: `Get metadata (including download URI) for an attachment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getAttachment,
    },
    async ({ attachmentId }) => {
      const result = await service.getAttachment(attachmentId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getAttachmentContent',
    {
      description: `Download the raw content of an attachment from the ${jiraInstanceType} as base64. Fetches the file behind the attachment's download URI.`,
      inputSchema: jiraToolSchemas.getAttachmentContent,
    },
    async ({ attachmentId }) => {
      const result = await service.getAttachmentContent(attachmentId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteAttachment',
    {
      description: `Delete an attachment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteAttachment,
    },
    async ({ attachmentId }) => {
      const result = await service.deleteAttachment(attachmentId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_linkIssues',
    {
      description: `Create a link between two JIRA issues in the ${jiraInstanceType} (e.g., "blocks", "relates to")`,
      inputSchema: jiraToolSchemas.linkIssues,
    },
    async ({ inwardIssueKey, outwardIssueKey, linkTypeName, comment }) => {
      const result = await service.linkIssues(inwardIssueKey, outwardIssueKey, linkTypeName, comment);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueLink',
    {
      description: `Get details of a link between two JIRA issues in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueLink,
    },
    async ({ linkId }) => {
      const result = await service.getIssueLink(linkId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteIssueLink',
    {
      description: `Delete a link between two JIRA issues in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueLink,
    },
    async ({ linkId }) => {
      const result = await service.deleteIssueLink(linkId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getRemoteIssueLinks',
    {
      description: `Get the remote issue links (e.g., links to Confluence pages or external URLs) for a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getRemoteIssueLinks,
    },
    async ({ issueIdOrKey, globalId }) => {
      const result = await service.getRemoteIssueLinks(issueIdOrKey, globalId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getRemoteIssueLink',
    {
      description: `Get a single remote issue link by its id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getRemoteIssueLink,
    },
    async ({ issueIdOrKey, linkId }) => {
      const result = await service.getRemoteIssueLink(issueIdOrKey, linkId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createOrUpdateRemoteIssueLink',
    {
      description: `Create a remote issue link on a JIRA issue in the ${jiraInstanceType} (e.g., link to a Confluence page or external URL). If globalId is provided and a link with that globalId already exists, it is updated instead of duplicated.`,
      inputSchema: jiraToolSchemas.createOrUpdateRemoteIssueLink,
    },
    async ({ issueIdOrKey, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
      const result = await service.createOrUpdateRemoteIssueLink(issueIdOrKey, { url, title, summary, globalId, relationship, applicationName, applicationType });

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateRemoteIssueLink',
    {
      description: `Update a remote issue link by its id on a JIRA issue in the ${jiraInstanceType}. Any fields not provided are set to null.`,
      inputSchema: jiraToolSchemas.updateRemoteIssueLink,
    },
    async ({ issueIdOrKey, linkId, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
      const result = await service.updateRemoteIssueLink(issueIdOrKey, linkId, { url, title, summary, globalId, relationship, applicationName, applicationType });

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteRemoteIssueLink',
    {
      description: `Delete a remote issue link by its id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteRemoteIssueLink,
    },
    async ({ issueIdOrKey, linkId }) => {
      const result = await service.deleteRemoteIssueLink(issueIdOrKey, linkId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteRemoteIssueLinkByGlobalId',
    {
      description: `Delete a remote issue link by its global id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteRemoteIssueLinkByGlobalId,
    },
    async ({ issueIdOrKey, globalId }) => {
      const result = await service.deleteRemoteIssueLinkByGlobalId(issueIdOrKey, globalId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_assignIssue',
    {
      description: `Assign or unassign a JIRA issue in the ${jiraInstanceType} via the dedicated assignee endpoint. Equivalent to setting the assignee field via jira_updateIssue, but simpler for this one common case.`,
      inputSchema: jiraToolSchemas.assignIssue,
    },
    async ({ issueKey, username }) => {
      const result = await service.assignIssue(issueKey, username);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueLinkTypes',
    {
      description: `Get all issue link types available in the ${jiraInstanceType} (e.g., "Blocks", "Relates", "Duplicate")`,
      inputSchema: jiraToolSchemas.getIssueLinkTypes,
    },
    async () => {
      const result = await service.getIssueLinkTypes();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createIssueLinkType',
    {
      description: `Create a new issue link type in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIssueLinkType,
    },
    async ({ name, inward, outward }) => {
      const result = await service.createIssueLinkType(name, inward, outward);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_updateIssueLinkType',
    {
      description: `Update an issue link type in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssueLinkType,
    },
    async ({ issueLinkTypeId, name, inward, outward }) => {
      const result = await service.updateIssueLinkType(issueLinkTypeId, name, inward, outward);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteIssueLinkType',
    {
      description: `Delete an issue link type from the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueLinkType,
    },
    async ({ issueLinkTypeId }) => {
      const result = await service.deleteIssueLinkType(issueLinkTypeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_createIssues',
    {
      description: `Create multiple JIRA issues in a single bulk request in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIssues,
    },
    async ({ issues }) => {
      const result = await service.createIssues(issues);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_archiveIssues',
    {
      description: `Bulk archive JIRA issues (by keys or JQL) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.archiveIssues,
    },
    async ({ issueKeysOrJql, notifyUsers }) => {
      const result = await service.archiveIssues(issueKeysOrJql, notifyUsers);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_archiveIssue',
    {
      description: `Archive a single JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.archiveIssue,
    },
    async ({ issueKey, notifyUsers }) => {
      const result = await service.archiveIssue(issueKey, notifyUsers);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_restoreIssue',
    {
      description: `Restore a previously archived JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.restoreIssue,
    },
    async ({ issueKey, notifyUsers }) => {
      const result = await service.restoreIssue(issueKey, notifyUsers);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_rankIssues',
    {
      description: `Reorder (rank) JIRA issues relative to another issue in the ${jiraInstanceType}, as used on Agile boards/backlogs`,
      inputSchema: jiraToolSchemas.rankIssues,
    },
    async ({ issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId }) => {
      const result = await service.rankIssues(issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssuePropertyKeys',
    {
      description: `Get the keys of all entity properties stored on an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssuePropertyKeys,
    },
    async ({ issueKey }) => {
      const result = await service.getIssuePropertyKeys(issueKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getIssueProperty',
    {
      description: `Get a single entity property value from an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueProperty,
    },
    async ({ issueKey, propertyKey }) => {
      const result = await service.getIssueProperty(issueKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_setIssueProperty',
    {
      description: `Set an entity property (arbitrary JSON key/value metadata) on an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setIssueProperty,
    },
    async ({ issueKey, propertyKey, value }) => {
      const result = await service.setIssueProperty(issueKey, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_deleteIssueProperty',
    {
      description: `Delete an entity property from an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteIssueProperty,
    },
    async ({ issueKey, propertyKey }) => {
      const result = await service.deleteIssueProperty(issueKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_notifyIssue',
    {
      description: `Send a manual email notification about a JIRA issue in the ${jiraInstanceType} to specific users, groups, or roles (reporter/assignee/watchers/voters)`,
      inputSchema: jiraToolSchemas.notifyIssue,
    },
    async ({ issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames }) => {
      const result = await service.notifyIssue(issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_setCommentPinned',
    {
      description: `Pin or unpin a comment on a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setCommentPinned,
    },
    async ({ issueKey, commentId, pinned }) => {
      const result = await service.setCommentPinned(issueKey, commentId, pinned);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_getPinnedComments',
    {
      description: `Get all pinned comments for a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPinnedComments,
    },
    async ({ issueKey }) => {
      const result = await service.getPinnedComments(issueKey);

      return formatToolResponse(result);
    },
  );
}
