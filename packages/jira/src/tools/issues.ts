import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerIssueTools(server: McpServer, service: JiraService) {
  server.tool(
    'jira_searchIssues',
    `Search for JIRA issues using JQL in the ${jiraInstanceType}`,
    jiraToolSchemas.searchIssues,
    async ({ jql, expand, startAt, maxResults, fields }) => {
      const result = await service.searchIssues(jql, startAt, expand, maxResults, fields);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssue',
    `Get details of a JIRA issue by its key from the ${jiraInstanceType}`,
    jiraToolSchemas.getIssue,
    async ({ issueKey, expand, fields }) => {
      const result = await service.getIssue(issueKey, expand, fields);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueComments',
    `Get comments of a JIRA issue by its key from the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueComments,
    async ({ issueKey, expand, maxResults, startAt }) => {
      const result = await service.getIssueComments(issueKey, expand, maxResults, startAt);

      return formatToolResponse(result);
    });

  server.tool(
    'jira_createIssue',
    `Create a new JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.createIssue,
    async (params) => {
      const result = await service.createIssue(params);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateIssue',
    `Update an existing JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.updateIssue,
    async (params) => {
      const result = await service.updateIssue(params);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_postIssueComment',
    `Post a comment on a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.postIssueComment,
    async ({ issueKey, comment }) => {
      const result = await service.postIssueComment(issueKey, comment);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getTransitions',
    `Get available status transitions for a JIRA issue in the ${jiraInstanceType}. Returns a list of transitions with their IDs, names, and target statuses.`,
    jiraToolSchemas.getTransitions,
    async ({ issueKey }) => {
      const result = await service.getTransitions(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueDevelopmentInfo',
    `Get linked development information (pull requests, commits, or branches) shown in the Development panel of a JIRA issue in the ${jiraInstanceType}. Defaults to pull requests from Bitbucket.`,
    jiraToolSchemas.getIssueDevelopmentInfo,
    async ({ issueKey, dataType, applicationType }) => {
      const result = await service.getIssueDevelopmentInfo(issueKey, dataType, applicationType);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_transitionIssue',
    `Transition a JIRA issue to a new status in the ${jiraInstanceType}. Use jira_getTransitions first to get available transition IDs.`,
    jiraToolSchemas.transitionIssue,
    async (params) => {
      const result = await service.transitionIssue(params);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueTypes',
    `Get all issue types available in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueTypes,
    async () => {
      const result = await service.getIssueTypes();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getPriorities',
    `Get all issue priorities available in the ${jiraInstanceType}`,
    jiraToolSchemas.getPriorities,
    async () => {
      const result = await service.getPriorities();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getResolutions',
    `Get all issue resolutions available in the ${jiraInstanceType}`,
    jiraToolSchemas.getResolutions,
    async () => {
      const result = await service.getResolutions();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getStatuses',
    `Get all issue statuses available in the ${jiraInstanceType}`,
    jiraToolSchemas.getStatuses,
    async () => {
      const result = await service.getStatuses();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCreateIssueMetaIssueTypes',
    `Get the issue types available for creating an issue in a project, in the ${jiraInstanceType}. Use before jira_createIssue to find a valid issueTypeId.`,
    jiraToolSchemas.getCreateIssueMetaIssueTypes,
    async ({ projectIdOrKey, maxResults, startAt }) => {
      const result = await service.getCreateIssueMetaIssueTypes(projectIdOrKey, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCreateIssueMetaFields',
    `Get the fields (required and optional) available for creating an issue of a given type in a project, in the ${jiraInstanceType}. Use before jira_createIssue to discover required fields.`,
    jiraToolSchemas.getCreateIssueMetaFields,
    async ({ projectIdOrKey, issueTypeId, maxResults, startAt }) => {
      const result = await service.getCreateIssueMetaFields(projectIdOrKey, issueTypeId, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getEditIssueMeta',
    `Get the fields available for editing an existing issue, in the ${jiraInstanceType}. Use before jira_updateIssue to discover which fields can be edited.`,
    jiraToolSchemas.getEditIssueMeta,
    async ({ issueKey }) => {
      const result = await service.getEditIssueMeta(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteIssue',
    `Delete a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteIssue,
    async ({ issueKey, deleteSubtasks }) => {
      const result = await service.deleteIssue(issueKey, deleteSubtasks);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateIssueComment',
    `Update the text of an existing comment on a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.updateIssueComment,
    async ({ issueKey, commentId, comment }) => {
      const result = await service.updateIssueComment(issueKey, commentId, comment);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteIssueComment',
    `Delete a comment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteIssueComment,
    async ({ issueKey, commentId }) => {
      const result = await service.deleteIssueComment(issueKey, commentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCommentPropertyKeys',
    `Get the keys of all entity properties stored on a comment in the ${jiraInstanceType}`,
    jiraToolSchemas.getCommentPropertyKeys,
    async ({ commentId }) => {
      const result = await service.getCommentPropertyKeys(commentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getCommentProperty',
    `Get a single entity property value from a comment in the ${jiraInstanceType}`,
    jiraToolSchemas.getCommentProperty,
    async ({ commentId, propertyKey }) => {
      const result = await service.getCommentProperty(commentId, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setCommentProperty',
    `Set an entity property (arbitrary JSON key/value metadata) on a comment in the ${jiraInstanceType}`,
    jiraToolSchemas.setCommentProperty,
    async ({ commentId, propertyKey, value }) => {
      const result = await service.setCommentProperty(commentId, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteCommentProperty',
    `Delete an entity property from a comment in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteCommentProperty,
    async ({ commentId, propertyKey }) => {
      const result = await service.deleteCommentProperty(commentId, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueWatchers',
    `Get the list of users watching a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueWatchers,
    async ({ issueKey }) => {
      const result = await service.getIssueWatchers(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addIssueWatcher',
    `Add a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.addIssueWatcher,
    async ({ issueKey, username }) => {
      const result = await service.addIssueWatcher(issueKey, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_removeIssueWatcher',
    `Remove a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.removeIssueWatcher,
    async ({ issueKey, username }) => {
      const result = await service.removeIssueWatcher(issueKey, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueVotes',
    `Get vote information for a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueVotes,
    async ({ issueKey }) => {
      const result = await service.getIssueVotes(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addIssueVote',
    `Cast a vote for a JIRA issue in the ${jiraInstanceType} (as the current user)`,
    jiraToolSchemas.addIssueVote,
    async ({ issueKey }) => {
      const result = await service.addIssueVote(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_removeIssueVote',
    `Remove the current user's vote from a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.removeIssueVote,
    async ({ issueKey }) => {
      const result = await service.removeIssueVote(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueWorklogs',
    `Get all worklog entries of a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueWorklogs,
    async ({ issueKey }) => {
      const result = await service.getIssueWorklogs(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addIssueWorklog',
    `Add a worklog entry (time tracking) to a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.addIssueWorklog,
    async ({ issueKey, timeSpent, comment, started }) => {
      const result = await service.addIssueWorklog(issueKey, timeSpent, comment, started);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueWorklog',
    `Get a single worklog entry of a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueWorklog,
    async ({ issueKey, worklogId }) => {
      const result = await service.getIssueWorklog(issueKey, worklogId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateIssueWorklog',
    `Update a worklog entry of a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.updateIssueWorklog,
    async ({ issueKey, worklogId, timeSpent, comment, started }) => {
      const result = await service.updateIssueWorklog(issueKey, worklogId, timeSpent, comment, started);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteIssueWorklog',
    `Delete a worklog entry from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteIssueWorklog,
    async ({ issueKey, worklogId }) => {
      const result = await service.deleteIssueWorklog(issueKey, worklogId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getWorklogsDeletedSince',
    `Get the ids of worklogs deleted since a given time across the whole ${jiraInstanceType}, for bulk sync`,
    jiraToolSchemas.getWorklogsDeletedSince,
    async ({ since }) => {
      const result = await service.getWorklogsDeletedSince(since);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getWorklogsModifiedSince',
    `Get the ids of worklogs modified since a given time across the whole ${jiraInstanceType}, for bulk sync`,
    jiraToolSchemas.getWorklogsModifiedSince,
    async ({ since }) => {
      const result = await service.getWorklogsModifiedSince(since);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getWorklogsForIds',
    `Get worklog details for a batch of worklog ids in the ${jiraInstanceType}`,
    jiraToolSchemas.getWorklogsForIds,
    async ({ worklogIds }) => {
      const result = await service.getWorklogsForIds(worklogIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addIssueAttachment',
    `Attach a file to a JIRA issue in the ${jiraInstanceType}. Provide file content as base64.`,
    jiraToolSchemas.addIssueAttachment,
    async ({ issueKey, fileName, contentBase64 }) => {
      const result = await service.addIssueAttachment(issueKey, fileName, contentBase64);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getAttachmentMeta',
    `Get attachment capabilities (enabled/disabled, max upload size) of the ${jiraInstanceType}`,
    jiraToolSchemas.getAttachmentMeta,
    async () => {
      const result = await service.getAttachmentMeta();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getAttachment',
    `Get metadata (including download URI) for an attachment in the ${jiraInstanceType}`,
    jiraToolSchemas.getAttachment,
    async ({ attachmentId }) => {
      const result = await service.getAttachment(attachmentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getAttachmentContent',
    `Download the raw content of an attachment from the ${jiraInstanceType} as base64. Fetches the file behind the attachment's download URI.`,
    jiraToolSchemas.getAttachmentContent,
    async ({ attachmentId }) => {
      const result = await service.getAttachmentContent(attachmentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteAttachment',
    `Delete an attachment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteAttachment,
    async ({ attachmentId }) => {
      const result = await service.deleteAttachment(attachmentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_linkIssues',
    `Create a link between two JIRA issues in the ${jiraInstanceType} (e.g., "blocks", "relates to")`,
    jiraToolSchemas.linkIssues,
    async ({ inwardIssueKey, outwardIssueKey, linkTypeName, comment }) => {
      const result = await service.linkIssues(inwardIssueKey, outwardIssueKey, linkTypeName, comment);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueLink',
    `Get details of a link between two JIRA issues in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueLink,
    async ({ linkId }) => {
      const result = await service.getIssueLink(linkId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteIssueLink',
    `Delete a link between two JIRA issues in the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteIssueLink,
    async ({ linkId }) => {
      const result = await service.deleteIssueLink(linkId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getRemoteIssueLinks',
    `Get the remote issue links (e.g., links to Confluence pages or external URLs) for a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getRemoteIssueLinks,
    async ({ issueIdOrKey, globalId }) => {
      const result = await service.getRemoteIssueLinks(issueIdOrKey, globalId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getRemoteIssueLink',
    `Get a single remote issue link by its id from the ${jiraInstanceType}`,
    jiraToolSchemas.getRemoteIssueLink,
    async ({ issueIdOrKey, linkId }) => {
      const result = await service.getRemoteIssueLink(issueIdOrKey, linkId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createOrUpdateRemoteIssueLink',
    `Create a remote issue link on a JIRA issue in the ${jiraInstanceType} (e.g., link to a Confluence page or external URL). If globalId is provided and a link with that globalId already exists, it is updated instead of duplicated.`,
    jiraToolSchemas.createOrUpdateRemoteIssueLink,
    async ({ issueIdOrKey, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
      const result = await service.createOrUpdateRemoteIssueLink(issueIdOrKey, { url, title, summary, globalId, relationship, applicationName, applicationType });

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateRemoteIssueLink',
    `Update a remote issue link by its id on a JIRA issue in the ${jiraInstanceType}. Any fields not provided are set to null.`,
    jiraToolSchemas.updateRemoteIssueLink,
    async ({ issueIdOrKey, linkId, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
      const result = await service.updateRemoteIssueLink(issueIdOrKey, linkId, { url, title, summary, globalId, relationship, applicationName, applicationType });

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteRemoteIssueLink',
    `Delete a remote issue link by its id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteRemoteIssueLink,
    async ({ issueIdOrKey, linkId }) => {
      const result = await service.deleteRemoteIssueLink(issueIdOrKey, linkId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteRemoteIssueLinkByGlobalId',
    `Delete a remote issue link by its global id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteRemoteIssueLinkByGlobalId,
    async ({ issueIdOrKey, globalId }) => {
      const result = await service.deleteRemoteIssueLinkByGlobalId(issueIdOrKey, globalId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_assignIssue',
    `Assign or unassign a JIRA issue in the ${jiraInstanceType} via the dedicated assignee endpoint. Equivalent to setting the assignee field via jira_updateIssue, but simpler for this one common case.`,
    jiraToolSchemas.assignIssue,
    async ({ issueKey, username }) => {
      const result = await service.assignIssue(issueKey, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueLinkTypes',
    `Get all issue link types available in the ${jiraInstanceType} (e.g., "Blocks", "Relates", "Duplicate")`,
    jiraToolSchemas.getIssueLinkTypes,
    async () => {
      const result = await service.getIssueLinkTypes();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createIssueLinkType',
    `Create a new issue link type in the ${jiraInstanceType}`,
    jiraToolSchemas.createIssueLinkType,
    async ({ name, inward, outward }) => {
      const result = await service.createIssueLinkType(name, inward, outward);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateIssueLinkType',
    `Update an issue link type in the ${jiraInstanceType}`,
    jiraToolSchemas.updateIssueLinkType,
    async ({ issueLinkTypeId, name, inward, outward }) => {
      const result = await service.updateIssueLinkType(issueLinkTypeId, name, inward, outward);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteIssueLinkType',
    `Delete an issue link type from the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteIssueLinkType,
    async ({ issueLinkTypeId }) => {
      const result = await service.deleteIssueLinkType(issueLinkTypeId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createIssues',
    `Create multiple JIRA issues in a single bulk request in the ${jiraInstanceType}`,
    jiraToolSchemas.createIssues,
    async ({ issues }) => {
      const result = await service.createIssues(issues);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_archiveIssues',
    `Bulk archive JIRA issues (by keys or JQL) in the ${jiraInstanceType}`,
    jiraToolSchemas.archiveIssues,
    async ({ issueKeysOrJql, notifyUsers }) => {
      const result = await service.archiveIssues(issueKeysOrJql, notifyUsers);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_archiveIssue',
    `Archive a single JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.archiveIssue,
    async ({ issueKey, notifyUsers }) => {
      const result = await service.archiveIssue(issueKey, notifyUsers);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_restoreIssue',
    `Restore a previously archived JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.restoreIssue,
    async ({ issueKey, notifyUsers }) => {
      const result = await service.restoreIssue(issueKey, notifyUsers);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_rankIssues',
    `Reorder (rank) JIRA issues relative to another issue in the ${jiraInstanceType}, as used on Agile boards/backlogs`,
    jiraToolSchemas.rankIssues,
    async ({ issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId }) => {
      const result = await service.rankIssues(issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssuePropertyKeys',
    `Get the keys of all entity properties stored on an issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssuePropertyKeys,
    async ({ issueKey }) => {
      const result = await service.getIssuePropertyKeys(issueKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getIssueProperty',
    `Get a single entity property value from an issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getIssueProperty,
    async ({ issueKey, propertyKey }) => {
      const result = await service.getIssueProperty(issueKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setIssueProperty',
    `Set an entity property (arbitrary JSON key/value metadata) on an issue in the ${jiraInstanceType}`,
    jiraToolSchemas.setIssueProperty,
    async ({ issueKey, propertyKey, value }) => {
      const result = await service.setIssueProperty(issueKey, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteIssueProperty',
    `Delete an entity property from an issue in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteIssueProperty,
    async ({ issueKey, propertyKey }) => {
      const result = await service.deleteIssueProperty(issueKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_notifyIssue',
    `Send a manual email notification about a JIRA issue in the ${jiraInstanceType} to specific users, groups, or roles (reporter/assignee/watchers/voters)`,
    jiraToolSchemas.notifyIssue,
    async ({ issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames }) => {
      const result = await service.notifyIssue(issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setCommentPinned',
    `Pin or unpin a comment on a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.setCommentPinned,
    async ({ issueKey, commentId, pinned }) => {
      const result = await service.setCommentPinned(issueKey, commentId, pinned);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getPinnedComments',
    `Get all pinned comments for a JIRA issue in the ${jiraInstanceType}`,
    jiraToolSchemas.getPinnedComments,
    async ({ issueKey }) => {
      const result = await service.getPinnedComments(issueKey);

      return formatToolResponse(result);
    },
  );
}
