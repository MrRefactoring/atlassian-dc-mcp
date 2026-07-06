import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse, registerAnnotatedTool } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerIssueTools(server: McpServer, service: JiraService) {
  registerAnnotatedTool(server,
    'jira_search_issues',
    {
      description: `Search for JIRA issues using JQL in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.searchIssues,
    },
    async ({ jql, expand, startAt, maxResults, fields }) => {
      const result = await service.searchIssues(jql, startAt, expand, maxResults, fields);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue',
    {
      description: `Get details of a JIRA issue by its key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssue,
    },
    async ({ issueKey, expand, fields }) => {
      const result = await service.getIssue(issueKey, expand, fields);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_comments',
    {
      description: `Get comments of a JIRA issue by its key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueComments,
    },
    async ({ issueKey, expand, maxResults, startAt }) => {
      const result = await service.getIssueComments(issueKey, expand, maxResults, startAt);

      return formatToolResponse(result);
    });

  registerAnnotatedTool(server,
    'jira_create_issue',
    {
      description: `Create a new JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIssue,
    },
    async (params) => {
      const result = await service.createIssue(params);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_update_issue',
    {
      description: `Update an existing JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssue,
    },
    async (params) => {
      const result = await service.updateIssue(params);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_post_issue_comment',
    {
      description: `Post a comment on a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.postIssueComment,
    },
    async ({ issueKey, comment }) => {
      const result = await service.postIssueComment(issueKey, comment);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_transitions',
    {
      description: `Get available status transitions for a JIRA issue in the ${jiraInstanceType}. Returns a list of transitions with their IDs, names, and target statuses.`,
      inputSchema: jiraToolSchemas.getTransitions,
    },
    async ({ issueKey }) => {
      const result = await service.getTransitions(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_development_info',
    {
      description: `Get linked development information (pull requests, commits, or branches) shown in the Development panel of a JIRA issue in the ${jiraInstanceType}. Defaults to pull requests from Bitbucket.`,
      inputSchema: jiraToolSchemas.getIssueDevelopmentInfo,
    },
    async ({ issueKey, dataType, applicationType }) => {
      const result = await service.getIssueDevelopmentInfo(issueKey, dataType, applicationType);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_transition_issue',
    {
      description: `Transition a JIRA issue to a new status in the ${jiraInstanceType}. Use jira_get_transitions first to get available transition IDs.`,
      inputSchema: jiraToolSchemas.transitionIssue,
    },
    async (params) => {
      const result = await service.transitionIssue(params);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_types',
    {
      description: `Get all issue types available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueTypes,
    },
    async () => {
      const result = await service.getIssueTypes();

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_priorities',
    {
      description: `Get all issue priorities available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getPriorities,
    },
    async () => {
      const result = await service.getPriorities();

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_resolutions',
    {
      description: `Get all issue resolutions available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getResolutions,
    },
    async () => {
      const result = await service.getResolutions();

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_statuses',
    {
      description: `Get all issue statuses available in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getStatuses,
    },
    async () => {
      const result = await service.getStatuses();

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_status_categories',
    {
      description: `Get all status categories (e.g. To Do / In Progress / Done) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getStatusCategories,
    },
    async () => {
      const result = await service.getStatusCategories();

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_status_category',
    {
      description: `Get a single status category by id or key in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getStatusCategory,
    },
    async ({ idOrKey }) => {
      const result = await service.getStatusCategory(idOrKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_picker_suggestions',
    {
      description: `Get issue suggestions for a picker (matching a query and/or JQL) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssuePickerSuggestions,
    },
    async ({ query, currentJQL, currentIssueKey, currentProjectId, showSubTasks, showSubTaskParent }) => {
      const result = await service.getIssuePickerSuggestions(query, currentJQL, currentIssueKey, currentProjectId, showSubTasks, showSubTaskParent);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_create_issue_meta_issue_types',
    {
      description: `Get the issue types available for creating an issue in a project, in the ${jiraInstanceType}. Use before jira_create_issue to find a valid issueTypeId.`,
      inputSchema: jiraToolSchemas.getCreateIssueMetaIssueTypes,
    },
    async ({ projectIdOrKey, maxResults, startAt }) => {
      const result = await service.getCreateIssueMetaIssueTypes(projectIdOrKey, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_create_issue_meta_fields',
    {
      description: `Get the fields (required and optional) available for creating an issue of a given type in a project, in the ${jiraInstanceType}. Use before jira_create_issue to discover required fields.`,
      inputSchema: jiraToolSchemas.getCreateIssueMetaFields,
    },
    async ({ projectIdOrKey, issueTypeId, maxResults, startAt }) => {
      const result = await service.getCreateIssueMetaFields(projectIdOrKey, issueTypeId, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_edit_issue_meta',
    {
      description: `Get the fields available for editing an existing issue, in the ${jiraInstanceType}. Use before jira_update_issue to discover which fields can be edited.`,
      inputSchema: jiraToolSchemas.getEditIssueMeta,
    },
    async ({ issueKey }) => {
      const result = await service.getEditIssueMeta(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_issue',
    {
      description: `Delete a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssue,
    },
    async ({ issueKey, deleteSubtasks }) => {
      const result = await service.deleteIssue(issueKey, deleteSubtasks);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_update_issue_comment',
    {
      description: `Update the text of an existing comment on a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssueComment,
    },
    async ({ issueKey, commentId, comment }) => {
      const result = await service.updateIssueComment(issueKey, commentId, comment);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_issue_comment',
    {
      description: `Delete a comment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueComment,
    },
    async ({ issueKey, commentId }) => {
      const result = await service.deleteIssueComment(issueKey, commentId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_comment_property_keys',
    {
      description: `Get the keys of all entity properties stored on a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCommentPropertyKeys,
    },
    async ({ commentId }) => {
      const result = await service.getCommentPropertyKeys(commentId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_comment_property',
    {
      description: `Get a single entity property value from a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getCommentProperty,
    },
    async ({ commentId, propertyKey }) => {
      const result = await service.getCommentProperty(commentId, propertyKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_set_comment_property',
    {
      description: `Set an entity property (arbitrary JSON key/value metadata) on a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setCommentProperty,
    },
    async ({ commentId, propertyKey, value }) => {
      const result = await service.setCommentProperty(commentId, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_comment_property',
    {
      description: `Delete an entity property from a comment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteCommentProperty,
    },
    async ({ commentId, propertyKey }) => {
      const result = await service.deleteCommentProperty(commentId, propertyKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_watchers',
    {
      description: `Get the list of users watching a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueWatchers,
    },
    async ({ issueKey }) => {
      const result = await service.getIssueWatchers(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_add_issue_watcher',
    {
      description: `Add a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addIssueWatcher,
    },
    async ({ issueKey, username }) => {
      const result = await service.addIssueWatcher(issueKey, username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_remove_issue_watcher',
    {
      description: `Remove a user as a watcher of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeIssueWatcher,
    },
    async ({ issueKey, username }) => {
      const result = await service.removeIssueWatcher(issueKey, username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_votes',
    {
      description: `Get vote information for a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueVotes,
    },
    async ({ issueKey }) => {
      const result = await service.getIssueVotes(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_add_issue_vote',
    {
      description: `Cast a vote for a JIRA issue in the ${jiraInstanceType} (as the current user)`,
      inputSchema: jiraToolSchemas.addIssueVote,
    },
    async ({ issueKey }) => {
      const result = await service.addIssueVote(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_remove_issue_vote',
    {
      description: `Remove the current user's vote from a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeIssueVote,
    },
    async ({ issueKey }) => {
      const result = await service.removeIssueVote(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_worklogs',
    {
      description: `Get all worklog entries of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueWorklogs,
    },
    async ({ issueKey }) => {
      const result = await service.getIssueWorklogs(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_add_issue_worklog',
    {
      description: `Add a worklog entry (time tracking) to a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addIssueWorklog,
    },
    async ({ issueKey, timeSpent, comment, started }) => {
      const result = await service.addIssueWorklog(issueKey, timeSpent, comment, started);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_worklog',
    {
      description: `Get a single worklog entry of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueWorklog,
    },
    async ({ issueKey, worklogId }) => {
      const result = await service.getIssueWorklog(issueKey, worklogId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_update_issue_worklog',
    {
      description: `Update a worklog entry of a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssueWorklog,
    },
    async ({ issueKey, worklogId, timeSpent, comment, started }) => {
      const result = await service.updateIssueWorklog(issueKey, worklogId, timeSpent, comment, started);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_issue_worklog',
    {
      description: `Delete a worklog entry from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueWorklog,
    },
    async ({ issueKey, worklogId }) => {
      const result = await service.deleteIssueWorklog(issueKey, worklogId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_worklogs_deleted_since',
    {
      description: `Get the ids of worklogs deleted since a given time across the whole ${jiraInstanceType}, for bulk sync`,
      inputSchema: jiraToolSchemas.getWorklogsDeletedSince,
    },
    async ({ since }) => {
      const result = await service.getWorklogsDeletedSince(since);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_worklogs_modified_since',
    {
      description: `Get the ids of worklogs modified since a given time across the whole ${jiraInstanceType}, for bulk sync`,
      inputSchema: jiraToolSchemas.getWorklogsModifiedSince,
    },
    async ({ since }) => {
      const result = await service.getWorklogsModifiedSince(since);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_worklogs_for_ids',
    {
      description: `Get worklog details for a batch of worklog ids in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getWorklogsForIds,
    },
    async ({ worklogIds }) => {
      const result = await service.getWorklogsForIds(worklogIds);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_add_issue_attachment',
    {
      description: `Attach a file to a JIRA issue in the ${jiraInstanceType}. Provide file content as base64.`,
      inputSchema: jiraToolSchemas.addIssueAttachment,
    },
    async ({ issueKey, fileName, contentBase64 }) => {
      const result = await service.addIssueAttachment(issueKey, fileName, contentBase64);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_attachment_meta',
    {
      description: `Get attachment capabilities (enabled/disabled, max upload size) of the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getAttachmentMeta,
    },
    async () => {
      const result = await service.getAttachmentMeta();

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_attachment',
    {
      description: `Get metadata (including download URI) for an attachment in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getAttachment,
    },
    async ({ attachmentId }) => {
      const result = await service.getAttachment(attachmentId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_attachment_content',
    {
      description: `Download the raw content of an attachment from the ${jiraInstanceType} as base64. Fetches the file behind the attachment's download URI.`,
      inputSchema: jiraToolSchemas.getAttachmentContent,
    },
    async ({ attachmentId }) => {
      const result = await service.getAttachmentContent(attachmentId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_attachment',
    {
      description: `Delete an attachment from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteAttachment,
    },
    async ({ attachmentId }) => {
      const result = await service.deleteAttachment(attachmentId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_link_issues',
    {
      description: `Create a link between two JIRA issues in the ${jiraInstanceType} (e.g., "blocks", "relates to")`,
      inputSchema: jiraToolSchemas.linkIssues,
    },
    async ({ inwardIssueKey, outwardIssueKey, linkTypeName, comment }) => {
      const result = await service.linkIssues(inwardIssueKey, outwardIssueKey, linkTypeName, comment);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_link',
    {
      description: `Get details of a link between two JIRA issues in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueLink,
    },
    async ({ linkId }) => {
      const result = await service.getIssueLink(linkId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_issue_link',
    {
      description: `Delete a link between two JIRA issues in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueLink,
    },
    async ({ linkId }) => {
      const result = await service.deleteIssueLink(linkId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_remote_issue_links',
    {
      description: `Get the remote issue links (e.g., links to Confluence pages or external URLs) for a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getRemoteIssueLinks,
    },
    async ({ issueIdOrKey, globalId }) => {
      const result = await service.getRemoteIssueLinks(issueIdOrKey, globalId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_remote_issue_link',
    {
      description: `Get a single remote issue link by its id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getRemoteIssueLink,
    },
    async ({ issueIdOrKey, linkId }) => {
      const result = await service.getRemoteIssueLink(issueIdOrKey, linkId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_create_or_update_remote_issue_link',
    {
      description: `Create a remote issue link on a JIRA issue in the ${jiraInstanceType} (e.g., link to a Confluence page or external URL). If globalId is provided and a link with that globalId already exists, it is updated instead of duplicated.`,
      inputSchema: jiraToolSchemas.createOrUpdateRemoteIssueLink,
    },
    async ({ issueIdOrKey, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
      const result = await service.createOrUpdateRemoteIssueLink(issueIdOrKey, { url, title, summary, globalId, relationship, applicationName, applicationType });

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_update_remote_issue_link',
    {
      description: `Update a remote issue link by its id on a JIRA issue in the ${jiraInstanceType}. Any fields not provided are set to null.`,
      inputSchema: jiraToolSchemas.updateRemoteIssueLink,
    },
    async ({ issueIdOrKey, linkId, url, title, summary, globalId, relationship, applicationName, applicationType }) => {
      const result = await service.updateRemoteIssueLink(issueIdOrKey, linkId, { url, title, summary, globalId, relationship, applicationName, applicationType });

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_remote_issue_link',
    {
      description: `Delete a remote issue link by its id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteRemoteIssueLink,
    },
    async ({ issueIdOrKey, linkId }) => {
      const result = await service.deleteRemoteIssueLink(issueIdOrKey, linkId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_remote_issue_link_by_global_id',
    {
      description: `Delete a remote issue link by its global id from a JIRA issue in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteRemoteIssueLinkByGlobalId,
    },
    async ({ issueIdOrKey, globalId }) => {
      const result = await service.deleteRemoteIssueLinkByGlobalId(issueIdOrKey, globalId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_assign_issue',
    {
      description: `Assign or unassign a JIRA issue in the ${jiraInstanceType} via the dedicated assignee endpoint. Equivalent to setting the assignee field via jira_update_issue, but simpler for this one common case.`,
      inputSchema: jiraToolSchemas.assignIssue,
    },
    async ({ issueKey, username }) => {
      const result = await service.assignIssue(issueKey, username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_link_types',
    {
      description: `Get all issue link types available in the ${jiraInstanceType} (e.g., "Blocks", "Relates", "Duplicate")`,
      inputSchema: jiraToolSchemas.getIssueLinkTypes,
    },
    async () => {
      const result = await service.getIssueLinkTypes();

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_create_issue_link_type',
    {
      description: `Create a new issue link type in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIssueLinkType,
    },
    async ({ name, inward, outward }) => {
      const result = await service.createIssueLinkType(name, inward, outward);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_update_issue_link_type',
    {
      description: `Update an issue link type in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateIssueLinkType,
    },
    async ({ issueLinkTypeId, name, inward, outward }) => {
      const result = await service.updateIssueLinkType(issueLinkTypeId, name, inward, outward);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_issue_link_type',
    {
      description: `Delete an issue link type from the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteIssueLinkType,
    },
    async ({ issueLinkTypeId }) => {
      const result = await service.deleteIssueLinkType(issueLinkTypeId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_create_issues',
    {
      description: `Create multiple JIRA issues in a single bulk request in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createIssues,
    },
    async ({ issues }) => {
      const result = await service.createIssues(issues);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_archive_issues',
    {
      description: `Bulk archive JIRA issues (by keys or JQL) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.archiveIssues,
    },
    async ({ issueKeysOrJql, notifyUsers }) => {
      const result = await service.archiveIssues(issueKeysOrJql, notifyUsers);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_archive_issue',
    {
      description: `Archive a single JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.archiveIssue,
    },
    async ({ issueKey, notifyUsers }) => {
      const result = await service.archiveIssue(issueKey, notifyUsers);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_restore_issue',
    {
      description: `Restore a previously archived JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.restoreIssue,
    },
    async ({ issueKey, notifyUsers }) => {
      const result = await service.restoreIssue(issueKey, notifyUsers);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_rank_issues',
    {
      description: `Reorder (rank) JIRA issues relative to another issue in the ${jiraInstanceType}, as used on Agile boards/backlogs`,
      inputSchema: jiraToolSchemas.rankIssues,
    },
    async ({ issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId }) => {
      const result = await service.rankIssues(issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_property_keys',
    {
      description: `Get the keys of all entity properties stored on an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssuePropertyKeys,
    },
    async ({ issueKey }) => {
      const result = await service.getIssuePropertyKeys(issueKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_issue_property',
    {
      description: `Get a single entity property value from an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getIssueProperty,
    },
    async ({ issueKey, propertyKey }) => {
      const result = await service.getIssueProperty(issueKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_set_issue_property',
    {
      description: `Set an entity property (arbitrary JSON key/value metadata) on an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setIssueProperty,
    },
    async ({ issueKey, propertyKey, value }) => {
      const result = await service.setIssueProperty(issueKey, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_delete_issue_property',
    {
      description: `Delete an entity property from an issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteIssueProperty,
    },
    async ({ issueKey, propertyKey }) => {
      const result = await service.deleteIssueProperty(issueKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_notify_issue',
    {
      description: `Send a manual email notification about a JIRA issue in the ${jiraInstanceType} to specific users, groups, or roles (reporter/assignee/watchers/voters)`,
      inputSchema: jiraToolSchemas.notifyIssue,
    },
    async ({ issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames }) => {
      const result = await service.notifyIssue(issueKey, subject, textBody, htmlBody, toReporter, toAssignee, toWatchers, toVoters, toUsernames, toGroupNames, restrictToGroupNames);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_set_comment_pinned',
    {
      description: `Pin or unpin a comment on a JIRA issue in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setCommentPinned,
    },
    async ({ issueKey, commentId, pinned }) => {
      const result = await service.setCommentPinned(issueKey, commentId, pinned);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'jira_get_pinned_comments',
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
