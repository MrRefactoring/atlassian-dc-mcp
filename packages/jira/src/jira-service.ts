import { z } from 'zod';
import { handleApiOperation, resolveOpenApiBase } from '@mrrefactoring/atlassian-dc-mcp-core';
import {
  AttachmentService,
  ComponentService,
  DashboardService,
  FilterService,
  GroupService,
  IssueLinkService,
  IssueLinkTypeService,
  IssueService,
  IssuetypeService,
  MyselfService,
  OpenAPI,
  PriorityService,
  ProjectService,
  ProjectsService,
  ResolutionService,
  SearchService,
  StatusService,
  UserService,
  VersionService,
} from './jira-client/index.js';
import type { VersionMoveBean } from './jira-client/models/VersionMoveBean.js';
import { request as __request } from './jira-client/core/request.js';
import type { StringList } from './jira-client/models/StringList.js';
import { getDefaultPageSize, getMissingConfig, JIRA_PRODUCT } from './config.js';

const DEFAULT_SEARCH_FIELDS = ['summary', 'description', 'status', 'assignee', 'reporter', 'priority', 'issuetype', 'labels', 'updated'];
const DEFAULT_ISSUE_FIELDS = [...DEFAULT_SEARCH_FIELDS, 'parent', 'subtasks'];

type DevelopmentDataType = 'pullrequest' | 'repository' | 'branch';
type DevelopmentApplicationType = 'stash' | 'bitbucket' | 'github' | 'githube';

function toIssueFieldSelection(fields: string[]): Array<StringList> {
  // The generated client types this query param as StringList[], but the API expects repeated string field names.
  return fields as unknown as Array<StringList>;
}

function resolveToken(token: string | (() => string | undefined), missingTokenMessage: string) {
  return async () => {
    const resolvedToken = typeof token === 'function' ? token() : token;
    if (!resolvedToken) {
      throw new Error(missingTokenMessage);
    }
    return resolvedToken;
  };
}

export class JiraService {
  private readonly getPageSize: () => number;

  constructor(
    host: string | undefined,
    token: string | (() => string | undefined),
    apiBasePath?: string,
    getPageSize: () => number = getDefaultPageSize,
  ) {
    OpenAPI.BASE = resolveOpenApiBase({
      host,
      apiBasePath,
      defaultBasePath: JIRA_PRODUCT.defaultApiBasePath ?? '/rest',
      strippableSuffixes: JIRA_PRODUCT.apiBasePathStrippableSuffixes,
    });
    OpenAPI.TOKEN = resolveToken(token, 'Missing required environment variable: JIRA_API_TOKEN');
    OpenAPI.VERSION = '2';
    this.getPageSize = getPageSize;
  }

  async searchIssues(jql: string, startAt?: number, expand?: string[], maxResults?: number, fields?: string[]) {
    return handleApiOperation(() => {
      return SearchService.searchUsingSearchRequest({
        jql,
        maxResults: maxResults ?? this.getPageSize(),
        fields: fields ?? DEFAULT_SEARCH_FIELDS,
        expand,
        startAt
      });
    }, 'Error searching issues');
  }

  async getIssue(issueKey: string, expand?: string, fields?: string[]) {
    return handleApiOperation(
      () => IssueService.getIssue(issueKey, expand, toIssueFieldSelection(fields ?? DEFAULT_ISSUE_FIELDS)),
      'Error getting issue'
    );
  }

  async getIssueComments(issueKey: string, expand?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => IssueService.getComments(issueKey, expand, (maxResults ?? this.getPageSize()).toString(), undefined, startAt?.toString()),
      'Error getting issue comments'
    );
  }

  async postIssueComment(issueKey: string, comment: string) {
    return handleApiOperation(() => IssueService.addComment(issueKey, undefined, { body: comment }), 'Error posting issue comment');
  }

  async createIssue(params: {
    projectId: string;
    summary: string;
    description: string;
    issueTypeId: string;
    customFields?: Record<string, any>;
  }) {
    return handleApiOperation(async () => {
      const standardFields = {
        project: { key: params.projectId },
        summary: params.summary,
        description: params.description,
        issuetype: { id: params.issueTypeId }
      };

      const fields = params.customFields
        ? { ...standardFields, ...params.customFields }
        : standardFields;

      return IssueService.createIssue(true, { fields });
    }, 'Error creating issue');
  }

  async updateIssue(params: {
    issueKey: string;
    summary?: string;
    description?: string;
    issueTypeId?: string;
    customFields?: Record<string, any>;
  }) {
    return handleApiOperation(async () => {
      const standardFields: Record<string, any> = {};
      if (params.summary !== undefined) {
        standardFields.summary = params.summary;
      }
      if (params.description !== undefined) {
        standardFields.description = params.description;
      }
      if (params.issueTypeId !== undefined) {
        standardFields.issuetype = { id: params.issueTypeId };
      }

      const fields = params.customFields
        ? { ...standardFields, ...params.customFields }
        : standardFields;

      return IssueService.editIssue(params.issueKey, 'true', { fields });
    }, 'Error updating issue');
  }

  async getTransitions(issueKey: string) {
    return handleApiOperation(
      () => IssueService.getTransitions(issueKey),
      'Error getting transitions'
    );
  }

  async getIssueDevelopmentInfo(
    issueKey: string,
    dataType: DevelopmentDataType = 'pullrequest',
    applicationType: DevelopmentApplicationType = 'stash',
  ) {
    return handleApiOperation(async () => {
      const issueId = await this.resolveIssueId(issueKey);
      return __request(OpenAPI, {
        method: 'GET',
        url: '/dev-status/1.0/issue/detail',
        query: { issueId, applicationType, dataType },
      });
    }, 'Error getting issue development info');
  }

  private async resolveIssueId(issueKey: string): Promise<string> {
    // The dev-status API is keyed by the numeric issue id, not the issue key.
    const issue = await IssueService.getIssue(issueKey, undefined, toIssueFieldSelection(['id']));
    if (!issue?.id) {
      throw new Error(`Could not resolve numeric id for issue ${issueKey}`);
    }
    return issue.id;
  }

  async transitionIssue(params: {
    issueKey: string;
    transitionId: string;
    fields?: Record<string, any>;
    customFields?: Record<string, any>;
  }) {
    return handleApiOperation(async () => {
      const requestBody: { transition: { id: string }; fields?: Record<string, any> } = {
        transition: { id: params.transitionId }
      };
      if (params.fields) {
        requestBody.fields = params.fields;
      }
      if (params.customFields) {
        Object.assign(requestBody, params.customFields);
      }
      return IssueService.doTransition(params.issueKey, requestBody);
    }, 'Error transitioning issue');
  }

  async getProjects(includeArchived?: boolean, expand?: string, recent?: number) {
    return handleApiOperation(
      () => ProjectService.getAllProjects(includeArchived, expand, recent),
      'Error getting projects'
    );
  }

  async searchProjects(query: string, maxResults?: number, allowEmptyQuery?: boolean) {
    return handleApiOperation(
      () => ProjectsService.searchForProjects(maxResults, query, allowEmptyQuery),
      'Error searching projects'
    );
  }

  async getProject(projectIdOrKey: string, expand?: string) {
    return handleApiOperation(
      () => ProjectService.getProject(projectIdOrKey, expand),
      'Error getting project'
    );
  }

  async getProjectComponents(projectIdOrKey: string) {
    return handleApiOperation(
      () => ProjectService.getProjectComponents(projectIdOrKey),
      'Error getting project components'
    );
  }

  async getProjectVersions(projectIdOrKey: string, expand?: string) {
    return handleApiOperation(
      () => ProjectService.getProjectVersions(projectIdOrKey, expand),
      'Error getting project versions'
    );
  }

  async getIssueTypes() {
    return handleApiOperation(() => IssuetypeService.getIssueAllTypes(), 'Error getting issue types');
  }

  async getPriorities() {
    return handleApiOperation(() => PriorityService.getPriorities(), 'Error getting priorities');
  }

  async getResolutions() {
    return handleApiOperation(() => ResolutionService.getResolutions(), 'Error getting resolutions');
  }

  async getStatuses() {
    return handleApiOperation(() => StatusService.getStatuses(), 'Error getting statuses');
  }

  async getCreateIssueMetaIssueTypes(projectIdOrKey: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => IssueService.getCreateIssueMetaProjectIssueTypes(projectIdOrKey, maxResults?.toString(), startAt?.toString()),
      'Error getting create-issue metadata issue types'
    );
  }

  async getCreateIssueMetaFields(projectIdOrKey: string, issueTypeId: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => IssueService.getCreateIssueMetaFields(issueTypeId, projectIdOrKey, maxResults?.toString(), startAt?.toString()),
      'Error getting create-issue metadata fields'
    );
  }

  async getEditIssueMeta(issueKey: string) {
    return handleApiOperation(() => IssueService.getEditIssueMeta(issueKey), 'Error getting edit-issue metadata');
  }

  async deleteIssue(issueKey: string, deleteSubtasks?: boolean) {
    return handleApiOperation(
      () => IssueService.deleteIssue(issueKey, deleteSubtasks?.toString()),
      'Error deleting issue'
    );
  }

  async updateIssueComment(issueKey: string, commentId: string, comment: string) {
    return handleApiOperation(
      () => IssueService.updateComment(issueKey, commentId, undefined, { body: comment }),
      'Error updating issue comment'
    );
  }

  async deleteIssueComment(issueKey: string, commentId: string) {
    return handleApiOperation(
      () => IssueService.deleteComment(issueKey, commentId),
      'Error deleting issue comment'
    );
  }

  async getIssueWatchers(issueKey: string) {
    return handleApiOperation(() => IssueService.getIssueWatchers(issueKey), 'Error getting issue watchers');
  }

  async addIssueWatcher(issueKey: string, username: string) {
    return handleApiOperation(
      () => IssueService.addWatcher1(issueKey, undefined, username),
      'Error adding issue watcher'
    );
  }

  async removeIssueWatcher(issueKey: string, username: string) {
    return handleApiOperation(
      () => IssueService.removeWatcher1(issueKey, username),
      'Error removing issue watcher'
    );
  }

  async getIssueVotes(issueKey: string) {
    return handleApiOperation(() => IssueService.getVotes(issueKey), 'Error getting issue votes');
  }

  async addIssueVote(issueKey: string) {
    return handleApiOperation(() => IssueService.addVote(issueKey), 'Error adding issue vote');
  }

  async removeIssueVote(issueKey: string) {
    return handleApiOperation(() => IssueService.removeVote(issueKey), 'Error removing issue vote');
  }

  async getIssueWorklogs(issueKey: string) {
    return handleApiOperation(() => IssueService.getIssueWorklog(issueKey), 'Error getting issue worklogs');
  }

  async addIssueWorklog(issueKey: string, timeSpent: string, comment?: string, started?: string) {
    return handleApiOperation(
      () => IssueService.addWorklog(issueKey, undefined, undefined, undefined, { timeSpent, comment, started }),
      'Error adding issue worklog'
    );
  }

  async getIssueWorklog(issueKey: string, worklogId: string) {
    return handleApiOperation(() => IssueService.getWorklog(issueKey, worklogId), 'Error getting issue worklog');
  }

  async updateIssueWorklog(issueKey: string, worklogId: string, timeSpent?: string, comment?: string, started?: string) {
    return handleApiOperation(
      () => IssueService.updateWorklog(issueKey, worklogId, undefined, undefined, { timeSpent, comment, started }),
      'Error updating issue worklog'
    );
  }

  async deleteIssueWorklog(issueKey: string, worklogId: string) {
    return handleApiOperation(
      () => IssueService.deleteWorklog(issueKey, worklogId),
      'Error deleting issue worklog'
    );
  }

  async addIssueAttachment(issueKey: string, fileName: string, contentBase64: string) {
    return handleApiOperation(() => {
      const file = new File([Buffer.from(contentBase64, 'base64')], fileName);
      return IssueService.addAttachment(issueKey, { file } as unknown as Blob);
    }, 'Error adding issue attachment');
  }

  async getAttachmentMeta() {
    return handleApiOperation(() => AttachmentService.getAttachmentMeta(), 'Error getting attachment capabilities');
  }

  async getAttachment(attachmentId: string) {
    return handleApiOperation(() => AttachmentService.getAttachment(attachmentId), 'Error getting attachment');
  }

  async deleteAttachment(attachmentId: string) {
    return handleApiOperation(
      () => AttachmentService.removeAttachment(attachmentId),
      'Error deleting attachment'
    );
  }

  async linkIssues(inwardIssueKey: string, outwardIssueKey: string, linkTypeName: string, comment?: string) {
    return handleApiOperation(
      () => IssueLinkService.linkIssues({
        inwardIssue: { key: inwardIssueKey },
        outwardIssue: { key: outwardIssueKey },
        type: { name: linkTypeName },
        ...(comment ? { comment: { body: comment } } : {}),
      }),
      'Error linking issues'
    );
  }

  async getIssueLink(linkId: string) {
    return handleApiOperation(() => IssueLinkService.getIssueLink(linkId), 'Error getting issue link');
  }

  async deleteIssueLink(linkId: string) {
    return handleApiOperation(() => IssueLinkService.deleteIssueLink(linkId), 'Error deleting issue link');
  }

  async assignIssue(issueKey: string, username: string | null) {
    return handleApiOperation(
      () => IssueService.assign(issueKey, { name: username } as unknown as { name: string }),
      'Error assigning issue'
    );
  }

  async createComponent(projectKey: string, name: string, description?: string, leadUserName?: string) {
    return handleApiOperation(
      () => ComponentService.createComponent({ project: projectKey, name, description, leadUserName }),
      'Error creating component'
    );
  }

  async getComponents(maxResults?: number, query?: string, projectIds?: string) {
    return handleApiOperation(
      () => ComponentService.getPaginatedComponents(maxResults?.toString(), query, projectIds),
      'Error getting components'
    );
  }

  async getComponent(componentId: string) {
    return handleApiOperation(() => ComponentService.getComponent(componentId), 'Error getting component');
  }

  async updateComponent(componentId: string, name?: string, description?: string, leadUserName?: string) {
    return handleApiOperation(
      () => ComponentService.updateComponent(componentId, { name, description, leadUserName }),
      'Error updating component'
    );
  }

  async deleteComponent(componentId: string, moveIssuesTo?: string) {
    return handleApiOperation(
      () => ComponentService.delete(componentId, moveIssuesTo),
      'Error deleting component'
    );
  }

  async getComponentRelatedIssues(componentId: string) {
    return handleApiOperation(
      () => ComponentService.getComponentRelatedIssues(componentId),
      'Error getting component related issue counts'
    );
  }

  async createVersion(projectKey: string, name: string, description?: string, releaseDate?: string, startDate?: string) {
    return handleApiOperation(
      () => VersionService.createVersion({ project: projectKey, name, description, releaseDate, startDate }),
      'Error creating version'
    );
  }

  async getVersions(projectIds?: number[], query?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => VersionService.getPaginatedVersions(maxResults ?? 100, query ?? '', projectIds, startAt),
      'Error getting versions'
    );
  }

  async getVersion(versionId: string, expand?: string) {
    return handleApiOperation(() => VersionService.getVersion(versionId, expand), 'Error getting version');
  }

  async updateVersion(versionId: string, name?: string, description?: string, released?: boolean, archived?: boolean, releaseDate?: string) {
    return handleApiOperation(
      () => VersionService.updateVersion(versionId, { name, description, released, archived, releaseDate }),
      'Error updating version'
    );
  }

  async deleteAndReplaceVersion(versionId: string, moveFixIssuesTo?: number, moveAffectedIssuesTo?: number) {
    return handleApiOperation(
      () => VersionService.delete1(versionId, { moveFixIssuesTo, moveAffectedIssuesTo }),
      'Error deleting version'
    );
  }

  async mergeVersion(versionId: string, moveIssuesToVersionId: string) {
    return handleApiOperation(
      () => VersionService.merge(moveIssuesToVersionId, versionId),
      'Error merging version'
    );
  }

  async moveVersion(versionId: string, position?: 'Earlier' | 'Later' | 'First' | 'Last', after?: string) {
    return handleApiOperation(
      () => VersionService.moveVersion(versionId, { position: position as VersionMoveBean.position | undefined, after }),
      'Error moving version'
    );
  }

  async getVersionRelatedIssues(versionId: string) {
    return handleApiOperation(
      () => VersionService.getVersionRelatedIssues(versionId),
      'Error getting version related issue counts'
    );
  }

  async getVersionUnresolvedIssues(versionId: string) {
    return handleApiOperation(
      () => VersionService.getVersionUnresolvedIssues(versionId),
      'Error getting version unresolved issue counts'
    );
  }

  async getProjectRoles(projectIdOrKey: string) {
    return handleApiOperation(() => ProjectService.getProjectRoles(projectIdOrKey), 'Error getting project roles');
  }

  async getProjectRole(projectIdOrKey: string, roleId: number) {
    return handleApiOperation(
      () => ProjectService.getProjectRole(projectIdOrKey, roleId),
      'Error getting project role'
    );
  }

  async setProjectRoleActors(projectIdOrKey: string, roleId: number, categorisedActors: Record<string, string[]>) {
    return handleApiOperation(
      () => ProjectService.setActors(projectIdOrKey, roleId, { categorisedActors, id: roleId }),
      'Error setting project role actors'
    );
  }

  async addProjectRoleActors(projectIdOrKey: string, roleId: number, users?: string[], groups?: string[]) {
    return handleApiOperation(
      () => ProjectService.addActorUsers(projectIdOrKey, roleId, {
        ...(users ? { user: users } : {}),
        ...(groups ? { group: groups } : {}),
      }),
      'Error adding project role actors'
    );
  }

  async deleteProjectRoleActor(projectIdOrKey: string, roleId: number, user?: string, group?: string) {
    return handleApiOperation(
      () => ProjectService.deleteActor(projectIdOrKey, roleId, user, group),
      'Error deleting project role actor'
    );
  }

  async getUser(username?: string, key?: string, includeDeleted?: boolean) {
    return handleApiOperation(
      () => UserService.getUser1(includeDeleted, key, username),
      'Error getting user'
    );
  }

  async findUsers(username: string, maxResults?: number, startAt?: number, includeActive?: boolean, includeInactive?: boolean) {
    return handleApiOperation(
      () => UserService.findUsers(includeInactive, maxResults, includeActive, startAt, username),
      'Error finding users'
    );
  }

  async findAssignableUsers(project: string, issueKey?: string, username?: string, maxResults?: number) {
    return handleApiOperation(
      () => UserService.findAssignableUsers1(issueKey, maxResults ?? 50, project, undefined, username),
      'Error finding assignable users'
    );
  }

  async createGroup(name: string) {
    return handleApiOperation(() => GroupService.createGroup({ name }), 'Error creating group');
  }

  async deleteGroup(groupname: string, swapGroup?: string) {
    return handleApiOperation(
      () => GroupService.removeGroup(groupname, swapGroup),
      'Error deleting group'
    );
  }

  async getGroupUsers(groupname: string, includeInactiveUsers?: boolean, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => GroupService.getUsersFromGroup(groupname, includeInactiveUsers?.toString(), maxResults?.toString(), startAt?.toString()),
      'Error getting group users'
    );
  }

  async addUserToGroup(groupname: string, username: string) {
    return handleApiOperation(
      () => GroupService.addUserToGroup(groupname, { name: username }),
      'Error adding user to group'
    );
  }

  async removeUserFromGroup(groupname: string, username: string) {
    return handleApiOperation(
      () => GroupService.removeUserFromGroup(groupname, username),
      'Error removing user from group'
    );
  }

  async createFilter(name: string, jql: string, description?: string, favourite?: boolean) {
    return handleApiOperation(
      () => FilterService.createFilter(undefined, { name, jql, description, favourite }),
      'Error creating filter'
    );
  }

  async getFilter(filterId: string, expand?: string[]) {
    return handleApiOperation(() => FilterService.getFilter(filterId, expand), 'Error getting filter');
  }

  async updateFilter(filterId: string, name?: string, jql?: string, description?: string, favourite?: boolean) {
    return handleApiOperation(
      () => FilterService.editFilter(filterId, undefined, { name, jql, description, favourite }),
      'Error updating filter'
    );
  }

  async deleteFilter(filterId: string) {
    return handleApiOperation(() => FilterService.deleteFilter(filterId), 'Error deleting filter');
  }

  async getFavouriteFilters() {
    return handleApiOperation(
      () => FilterService.getFavouriteFilters(),
      'Error getting favourite filters'
    );
  }

  async getDashboards(filter?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => DashboardService.list(filter, maxResults?.toString(), startAt?.toString()),
      'Error getting dashboards'
    );
  }

  async getDashboard(dashboardId: string) {
    return handleApiOperation(() => DashboardService.getDashboard(dashboardId), 'Error getting dashboard');
  }

  async getIssueLinkTypes() {
    return handleApiOperation(
      () => IssueLinkTypeService.getIssueLinkTypes(),
      'Error getting issue link types'
    );
  }

  async createIssueLinkType(name: string, inward: string, outward: string) {
    return handleApiOperation(
      () => IssueLinkTypeService.createIssueLinkType({ name, inward, outward }),
      'Error creating issue link type'
    );
  }

  async updateIssueLinkType(issueLinkTypeId: string, name?: string, inward?: string, outward?: string) {
    return handleApiOperation(
      () => IssueLinkTypeService.updateIssueLinkType(issueLinkTypeId, { name, inward, outward }),
      'Error updating issue link type'
    );
  }

  async deleteIssueLinkType(issueLinkTypeId: string) {
    return handleApiOperation(
      () => IssueLinkTypeService.deleteIssueLinkType(issueLinkTypeId),
      'Error deleting issue link type'
    );
  }

  async validateSetup(): Promise<void> {
    await MyselfService.getUser();
  }

  static validateConfig(): string[] {
    return getMissingConfig();
  }
}

export const jiraToolSchemas = {
  searchIssues: {
    jql: z.string().describe("JQL query string"),
    maxResults: z.number().optional().describe("Maximum number of results to return"),
    startAt: z.number().optional().describe("Index of the first result to return"),
    expand: z.array(z.string()).optional().describe("Additional sections to expand in the search response, such as renderedFields, names, or schema"),
    fields: z.array(z.string()).optional().describe("Issue field names to include in the response. When omitted, a moderate-detail default field set is used.")
  },
  getIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    expand: z.string().optional().describe("Comma-separated response sections to expand, such as renderedFields, changelog, or transitions"),
    fields: z.array(z.string()).optional().describe("Issue field names to include in the response. When omitted, a moderate-detail default field set is used.")
  },
  getIssueComments: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    expand: z.string().optional().describe("Comma-separated comment expansions, such as renderedBody"),
    maxResults: z.number().optional().describe("Maximum number of comments to return"),
    startAt: z.number().optional().describe("Index of the first comment to return")
  },
  postIssueComment: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    comment: z.string().describe("Comment text in the format suitable for JIRA DATA CENTER edition (JIRA Wiki Markup).")
  },
  createIssue: {
    projectId: z.string().describe("Project key (despite the parameter name, e.g. TEST)"),
    summary: z.string().describe("Issue summary"),
    description: z.string().describe("Issue description in the format suitable for JIRA DATA CENTER edition (JIRA Wiki Markup)."),
    issueTypeId: z.string().describe("Issue type id (e.g. id of Task, Bug, Story). Should be found first a correct number for specific JIRA installation."),
    customFields: z.record(z.any()).optional().describe("Optional fields merged into the JIRA create payload. Can be used for custom fields and standard fields such as labels. Examples: {'customfield_10001': 'Custom Value', 'priority': {'id': '1'}, 'assignee': {'name': 'john.doe'}, 'labels': ['urgent', 'bug']}")
  },
  updateIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    summary: z.string().optional().describe("New summary (optional)"),
    description: z.string().optional().describe("New description in JIRA Wiki Markup (optional)"),
    issueTypeId: z.string().optional().describe("New issue type id (optional)"),
    customFields: z.record(z.any()).optional().describe("Optional fields merged into the JIRA update payload. Can be used for custom fields and standard fields such as labels. Examples: {'customfield_10001': 'Custom Value', 'priority': {'id': '1'}, 'assignee': {'name': 'john.doe'}, 'labels': ['urgent', 'bug']}")
  },
  getTransitions: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  getIssueDevelopmentInfo: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    dataType: z.enum(['pullrequest', 'repository', 'branch']).optional().describe("Development data to fetch: 'pullrequest' (default), 'repository' (commits), or 'branch'"),
    applicationType: z.enum(['stash', 'bitbucket', 'github', 'githube']).optional().describe("Linked SCM type: 'stash' (Bitbucket Server/Data Center, default), 'bitbucket' (Cloud), 'github', or 'githube' (GitHub Enterprise)")
  },
  transitionIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    transitionId: z.string().describe("The ID of the transition to perform. Use jira_getTransitions to find available transitions and their IDs."),
    fields: z.record(z.any()).optional().describe("Optional fields required by the transition screen. Use jira_getTransitions to see which fields are available for each transition."),
    customFields: z.record(z.any()).optional().describe("Optional fields merged into the JIRA transition payload. Can be used for update operations such as comments. Example: {'update': {'comment': [{'add': {'body': 'text'}}]}}")
  },
  getProjects: {
    includeArchived: z.boolean().optional().describe("Whether to include archived projects in the response"),
    expand: z.string().optional().describe("Comma-separated project sections to expand, such as description, lead, or issueTypes"),
    recent: z.number().optional().describe("Limit results to this many recently viewed projects")
  },
  searchProjects: {
    query: z.string().describe("Free-text query matched against project name and/or key"),
    maxResults: z.number().optional().describe("Maximum number of matching projects to return (hard limit of 100)"),
    allowEmptyQuery: z.boolean().optional().describe("Whether an empty query should match all projects instead of none")
  },
  getProject: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    expand: z.string().optional().describe("Comma-separated project sections to expand, such as description, lead, or issueTypes")
  },
  getProjectComponents: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)")
  },
  getProjectVersions: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    expand: z.string().optional().describe("Comma-separated version sections to expand, such as operations")
  },
  getIssueTypes: {},
  getPriorities: {},
  getResolutions: {},
  getStatuses: {},
  getCreateIssueMetaIssueTypes: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    maxResults: z.number().optional().describe("Maximum number of issue types to return"),
    startAt: z.number().optional().describe("Index of the first issue type to return")
  },
  getCreateIssueMetaFields: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    issueTypeId: z.string().describe("Issue type id. Use jira_getCreateIssueMetaIssueTypes to find valid ids for the project."),
    maxResults: z.number().optional().describe("Maximum number of fields to return"),
    startAt: z.number().optional().describe("Index of the first field to return")
  },
  getEditIssueMeta: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  deleteIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    deleteSubtasks: z.boolean().optional().describe("Whether to also delete the issue's subtasks. If false and subtasks exist, the delete fails.")
  },
  updateIssueComment: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    commentId: z.string().describe("Id of the comment to update. Use jira_getIssueComments to find comment ids."),
    comment: z.string().describe("New comment text in the format suitable for JIRA DATA CENTER edition (JIRA Wiki Markup).")
  },
  deleteIssueComment: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    commentId: z.string().describe("Id of the comment to delete. Use jira_getIssueComments to find comment ids.")
  },
  getIssueWatchers: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  addIssueWatcher: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    username: z.string().describe("Username of the user to add as a watcher")
  },
  removeIssueWatcher: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    username: z.string().describe("Username of the watcher to remove")
  },
  getIssueVotes: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  addIssueVote: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  removeIssueVote: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  getIssueWorklogs: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)")
  },
  addIssueWorklog: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    timeSpent: z.string().describe("Time spent in JIRA duration format (e.g., '3h', '1d 4h', '30m')"),
    comment: z.string().optional().describe("Worklog comment text"),
    started: z.string().optional().describe("When the work was started, ISO-like JIRA datetime format (e.g., '2024-01-15T09:00:00.000+0000'). Defaults to now if omitted.")
  },
  getIssueWorklog: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    worklogId: z.string().describe("Id of the worklog entry. Use jira_getIssueWorklogs to find worklog ids.")
  },
  updateIssueWorklog: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    worklogId: z.string().describe("Id of the worklog entry to update. Use jira_getIssueWorklogs to find worklog ids."),
    timeSpent: z.string().optional().describe("New time spent in JIRA duration format (e.g., '3h', '1d 4h', '30m')"),
    comment: z.string().optional().describe("New worklog comment text"),
    started: z.string().optional().describe("New start datetime, JIRA datetime format")
  },
  deleteIssueWorklog: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    worklogId: z.string().describe("Id of the worklog entry to delete. Use jira_getIssueWorklogs to find worklog ids.")
  },
  addIssueAttachment: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    fileName: z.string().describe("File name to attach, including extension (e.g., 'screenshot.png')"),
    contentBase64: z.string().describe("File content encoded as base64")
  },
  getAttachmentMeta: {},
  getAttachment: {
    attachmentId: z.string().describe("Id of the attachment")
  },
  deleteAttachment: {
    attachmentId: z.string().describe("Id of the attachment to delete")
  },
  linkIssues: {
    inwardIssueKey: z.string().describe("Key of the inward issue (e.g., the issue that 'blocks', 'is caused by', etc., depending on linkTypeName direction)"),
    outwardIssueKey: z.string().describe("Key of the outward issue"),
    linkTypeName: z.string().describe("Name of the issue link type (e.g., 'Blocks', 'Relates', 'Duplicate'). Use jira_getIssueLinkTypes to find valid names."),
    comment: z.string().optional().describe("Optional comment added to the inward issue when the link is created")
  },
  getIssueLink: {
    linkId: z.string().describe("Id of the issue link")
  },
  deleteIssueLink: {
    linkId: z.string().describe("Id of the issue link to delete")
  },
  assignIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    username: z.string().nullable().describe("Username to assign the issue to, '-1' for automatic assignee, or null to unassign")
  },
  createComponent: {
    projectKey: z.string().describe("Project key the component belongs to (e.g., TEST)"),
    name: z.string().describe("Component name"),
    description: z.string().optional().describe("Component description"),
    leadUserName: z.string().optional().describe("Username of the component lead")
  },
  getComponents: {
    maxResults: z.number().optional().describe("Maximum number of components to return (default 100)"),
    query: z.string().optional().describe("Free-text query matched against component names"),
    projectIds: z.string().optional().describe("Comma-separated project ids to filter components by")
  },
  getComponent: {
    componentId: z.string().describe("Id of the component")
  },
  updateComponent: {
    componentId: z.string().describe("Id of the component to update"),
    name: z.string().optional().describe("New component name"),
    description: z.string().optional().describe("New component description"),
    leadUserName: z.string().optional().describe("New component lead username")
  },
  deleteComponent: {
    componentId: z.string().describe("Id of the component to delete"),
    moveIssuesTo: z.string().optional().describe("Id of another component to move affected issues to. If omitted, the component is simply removed from issues.")
  },
  getComponentRelatedIssues: {
    componentId: z.string().describe("Id of the component")
  },
  createVersion: {
    projectKey: z.string().describe("Project key the version belongs to (e.g., TEST)"),
    name: z.string().describe("Version name (e.g., '1.0')"),
    description: z.string().optional().describe("Version description"),
    releaseDate: z.string().optional().describe("Planned/actual release date (e.g., '2024-01-15')"),
    startDate: z.string().optional().describe("Planned start date (e.g., '2024-01-01')")
  },
  getVersions: {
    projectIds: z.array(z.number()).optional().describe("Project ids to filter versions by"),
    query: z.string().optional().describe("Free-text query matched against version names"),
    maxResults: z.number().optional().describe("Maximum number of versions to return (default 100)"),
    startAt: z.number().optional().describe("Index of the first version to return")
  },
  getVersion: {
    versionId: z.string().describe("Id of the version"),
    expand: z.string().optional().describe("Comma-separated version sections to expand, such as operations")
  },
  updateVersion: {
    versionId: z.string().describe("Id of the version to update"),
    name: z.string().optional().describe("New version name"),
    description: z.string().optional().describe("New version description"),
    released: z.boolean().optional().describe("Whether the version is released"),
    archived: z.boolean().optional().describe("Whether the version is archived"),
    releaseDate: z.string().optional().describe("New release date")
  },
  deleteAndReplaceVersion: {
    versionId: z.string().describe("Id of the version to delete"),
    moveFixIssuesTo: z.number().optional().describe("Id of the version to move issues with this fixVersion to. If omitted, the fixVersion is simply removed."),
    moveAffectedIssuesTo: z.number().optional().describe("Id of the version to move issues with this affectedVersion to. If omitted, the affectedVersion is simply removed.")
  },
  mergeVersion: {
    versionId: z.string().describe("Id of the version to merge away"),
    moveIssuesToVersionId: z.string().describe("Id of the version that will absorb the merged version's issues")
  },
  moveVersion: {
    versionId: z.string().describe("Id of the version to reposition"),
    position: z.enum(['Earlier', 'Later', 'First', 'Last']).optional().describe("Relative position to move the version to within its project's version sequence"),
    after: z.string().describe("URI (self link) of the version to place this version after, from jira_getVersions/jira_getVersion. Required unless position is set.").optional()
  },
  getVersionRelatedIssues: {
    versionId: z.string().describe("Id of the version")
  },
  getVersionUnresolvedIssues: {
    versionId: z.string().describe("Id of the version")
  },
  getProjectRoles: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)")
  },
  getProjectRole: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    roleId: z.number().describe("Id of the project role. Use jira_getProjectRoles to find role ids.")
  },
  setProjectRoleActors: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    roleId: z.number().describe("Id of the project role. Use jira_getProjectRoles to find role ids."),
    categorisedActors: z.record(z.array(z.string())).describe("Replaces all actors for the role. Keys are actor categories (e.g., 'atlassian-user-role-actor', 'atlassian-group-role-actor'), values are lists of usernames/group names.")
  },
  addProjectRoleActors: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    roleId: z.number().describe("Id of the project role. Use jira_getProjectRoles to find role ids."),
    users: z.array(z.string()).optional().describe("Usernames to add as actors for this role"),
    groups: z.array(z.string()).optional().describe("Group names to add as actors for this role")
  },
  deleteProjectRoleActor: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    roleId: z.number().describe("Id of the project role. Use jira_getProjectRoles to find role ids."),
    user: z.string().optional().describe("Username of the actor to remove"),
    group: z.string().optional().describe("Group name of the actor to remove")
  },
  getUser: {
    username: z.string().optional().describe("Username to look up. Either username or key must be provided."),
    key: z.string().optional().describe("User key to look up. Either username or key must be provided."),
    includeDeleted: z.boolean().optional().describe("Whether to include deleted users in the lookup")
  },
  findUsers: {
    username: z.string().describe("Free-text query matched against username, name, and email. Use '.' or '' to match all users."),
    maxResults: z.number().optional().describe("Maximum number of users to return"),
    startAt: z.number().optional().describe("Index of the first user to return"),
    includeActive: z.boolean().optional().describe("Whether to include active users (default true)"),
    includeInactive: z.boolean().optional().describe("Whether to include inactive users (default false)")
  },
  findAssignableUsers: {
    project: z.string().describe("Project key to search assignable users within"),
    issueKey: z.string().optional().describe("JIRA issue key to search assignable users for, instead of/in addition to project"),
    username: z.string().optional().describe("Free-text query to filter candidate usernames"),
    maxResults: z.number().optional().describe("Maximum number of users to return (default 50)")
  },
  createGroup: {
    name: z.string().describe("Name of the group to create")
  },
  deleteGroup: {
    groupname: z.string().describe("Name of the group to delete"),
    swapGroup: z.string().optional().describe("Name of another group to transfer this group's permissions/restrictions to")
  },
  getGroupUsers: {
    groupname: z.string().describe("Name of the group"),
    includeInactiveUsers: z.boolean().optional().describe("Whether to include inactive users"),
    maxResults: z.number().optional().describe("Maximum number of users to return"),
    startAt: z.number().optional().describe("Index of the first user to return")
  },
  addUserToGroup: {
    groupname: z.string().describe("Name of the group"),
    username: z.string().describe("Username of the user to add")
  },
  removeUserFromGroup: {
    groupname: z.string().describe("Name of the group"),
    username: z.string().describe("Username of the user to remove")
  },
  createFilter: {
    name: z.string().describe("Filter name"),
    jql: z.string().describe("JQL query the filter runs"),
    description: z.string().optional().describe("Filter description"),
    favourite: z.boolean().optional().describe("Whether to mark the filter as a favourite for the current user")
  },
  getFilter: {
    filterId: z.string().describe("Id of the filter"),
    expand: z.array(z.string()).optional().describe("Additional sections to expand, such as sharedUsers or subscriptions")
  },
  updateFilter: {
    filterId: z.string().describe("Id of the filter to update"),
    name: z.string().optional().describe("New filter name"),
    jql: z.string().optional().describe("New JQL query"),
    description: z.string().optional().describe("New filter description"),
    favourite: z.boolean().optional().describe("Whether the filter is a favourite for the current user")
  },
  deleteFilter: {
    filterId: z.string().describe("Id of the filter to delete")
  },
  getFavouriteFilters: {},
  getDashboards: {
    filter: z.enum(['favourite', 'my']).optional().describe("Restrict results to 'favourite' or 'my' dashboards. Omit to return all visible dashboards."),
    maxResults: z.number().optional().describe("Maximum number of dashboards to return"),
    startAt: z.number().optional().describe("Index of the first dashboard to return")
  },
  getDashboard: {
    dashboardId: z.string().describe("Id of the dashboard")
  },
  getIssueLinkTypes: {},
  createIssueLinkType: {
    name: z.string().describe("Name of the new issue link type (e.g., 'Blocks')"),
    inward: z.string().describe("Inward relationship description (e.g., 'is blocked by')"),
    outward: z.string().describe("Outward relationship description (e.g., 'blocks')")
  },
  updateIssueLinkType: {
    issueLinkTypeId: z.string().describe("Id of the issue link type to update. Use jira_getIssueLinkTypes to find ids."),
    name: z.string().optional().describe("New name for the link type"),
    inward: z.string().optional().describe("New inward relationship description"),
    outward: z.string().optional().describe("New outward relationship description")
  },
  deleteIssueLinkType: {
    issueLinkTypeId: z.string().describe("Id of the issue link type to delete")
  }
};
