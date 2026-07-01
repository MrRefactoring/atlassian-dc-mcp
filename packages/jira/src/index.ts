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
  "jira_rankIssues",
  `Reorder (rank) JIRA issues relative to another issue in the ${jiraInstanceType}, as used on Agile boards/backlogs`,
  jiraToolSchemas.rankIssues,
  async ({ issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId }) => {
    const result = await jiraService.rankIssues(issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId);
    return formatToolResponse(result);
  }
);

await connectServer(server);
