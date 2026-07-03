import { z } from 'zod';
import { handleApiOperation, resolveOpenApiBase } from 'datacenter-mcp-core';
import {
  ApplicationroleService,
  AttachmentService,
  AvatarService,
  BacklogService,
  BoardService,
  ComponentService,
  CustomFieldOptionService,
  CustomFieldsService,
  DashboardService,
  EpicService,
  FieldService,
  FilterService,
  GroupService,
  GroupsService,
  GroupuserpickerService,
  IssueLinkService,
  IssueLinkTypeService,
  IssueService,
  IssuesecurityschemesService,
  IssuetypeschemeService,
  IssuetypeService,
  JqlService,
  MypermissionsService,
  MypreferencesService,
  MyselfService,
  NotificationschemeService,
  OpenAPI,
  PermissionsService,
  PermissionschemeService,
  PriorityschemesService,
  PriorityService,
  ProjectCategoryService,
  ProjectService,
  ProjectsService,
  ProjectvalidateService,
  ResolutionService,
  RoleService,
  ScreensService,
  SearchService,
  SecuritylevelService,
  SprintService,
  StatusService,
  UniversalAvatarService,
  UserService,
  VersionService,
  WorkflowService,
  WorkflowschemeService,
} from './jira-client/index.js';
import type { VersionMoveBean } from './jira-client/models/VersionMoveBean.js';
import type { MoveFieldBean } from './jira-client/models/MoveFieldBean.js';
import type { ProjectInputBean } from './jira-client/models/ProjectInputBean.js';
import type { ProjectUpdateBean } from './jira-client/models/ProjectUpdateBean.js';
import type { RemoteIssueLinkCreateOrUpdateRequest } from './jira-client/models/RemoteIssueLinkCreateOrUpdateRequest.js';
import { request as __request, resolve as __resolveAuth } from './jira-client/core/request.js';
import type { StringList } from './jira-client/models/StringList.js';
import type { FilePart } from './jira-client/models/FilePart.js';
import { getDefaultPageSize, getMissingConfig, JIRA_PRODUCT } from './config.js';

const DEFAULT_SEARCH_FIELDS = ['summary', 'description', 'status', 'assignee', 'reporter', 'priority', 'issuetype', 'labels', 'updated'];
const DEFAULT_ISSUE_FIELDS = [...DEFAULT_SEARCH_FIELDS, 'parent', 'subtasks'];

type DevelopmentDataType = 'pullrequest' | 'repository' | 'branch';
type DevelopmentApplicationType = 'stash' | 'bitbucket' | 'github' | 'githube';

function toIssueFieldSelection(fields: string[]): Array<StringList> {
  // The generated client types this query param as StringList[], but the API expects repeated string field names.
  return fields as unknown as Array<StringList>;
}

function resolveCredential(value: string | (() => string | undefined) | undefined) {
  return async () => {
    const resolved = typeof value === 'function' ? value() : value;
    return resolved ?? '';
  };
}

export class JiraService {
  private readonly getPageSize: () => number;

  constructor(
    host: string | undefined,
    token: string | (() => string | undefined),
    apiBasePath?: string,
    getPageSize: () => number = getDefaultPageSize,
    username?: string | (() => string | undefined),
    password?: string | (() => string | undefined),
  ) {
    OpenAPI.BASE = resolveOpenApiBase({
      host,
      apiBasePath,
      defaultBasePath: JIRA_PRODUCT.defaultApiBasePath ?? '/rest',
      strippableSuffixes: JIRA_PRODUCT.apiBasePathStrippableSuffixes,
    });
    OpenAPI.TOKEN = resolveCredential(token);
    OpenAPI.USERNAME = resolveCredential(username);
    OpenAPI.PASSWORD = resolveCredential(password);
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

  async createProject(project: Omit<ProjectInputBean, 'assigneeType'> & { assigneeType?: 'PROJECT_LEAD' | 'UNASSIGNED' }) {
    return handleApiOperation(
      () => ProjectService.createProject(project as ProjectInputBean),
      'Error creating project'
    );
  }

  async updateProject(projectIdOrKey: string, project: Omit<ProjectUpdateBean, 'assigneeType'> & { assigneeType?: 'PROJECT_LEAD' | 'UNASSIGNED' }, expand?: string) {
    return handleApiOperation(
      () => ProjectService.updateProject(projectIdOrKey, project as ProjectUpdateBean, expand),
      'Error updating project'
    );
  }

  async deleteProject(projectIdOrKey: string) {
    const result = await handleApiOperation(
      () => ProjectService.deleteProject(projectIdOrKey),
      'Error deleting project'
    );
    if (result.success) {
      return { ...result, data: { deleted: true, projectIdOrKey } };
    }
    return result;
  }

  async archiveProject(projectIdOrKey: string) {
    const result = await handleApiOperation(
      () => ProjectService.archiveProject(projectIdOrKey),
      'Error archiving project'
    );
    if (result.success) {
      return { ...result, data: { archived: true, projectIdOrKey } };
    }
    return result;
  }

  async restoreProject(projectIdOrKey: string) {
    return handleApiOperation(
      () => ProjectService.restoreProject(projectIdOrKey),
      'Error restoring project'
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

  async getAttachmentContent(attachmentId: string) {
    return handleApiOperation(async () => {
      const meta = await AttachmentService.getAttachment(attachmentId) as Record<string, any>;
      const contentUrl = meta?.content;
      if (!contentUrl) {
        throw new Error('Attachment metadata did not include a content URL');
      }
      const token = await __resolveAuth({ method: 'GET', url: contentUrl }, OpenAPI.TOKEN);
      const response = await fetch(contentUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) {
        throw new Error(`Failed to download attachment content: ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return {
        filename: meta.filename,
        mimeType: meta.mimeType,
        size: meta.size,
        contentBase64: Buffer.from(arrayBuffer).toString('base64'),
      };
    }, 'Error downloading attachment content');
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

  private buildRemoteIssueLinkBody(params: {
    url: string;
    title: string;
    summary?: string;
    globalId?: string;
    relationship?: string;
    applicationName?: string;
    applicationType?: string;
  }): RemoteIssueLinkCreateOrUpdateRequest {
    return {
      ...(params.globalId ? { globalId: params.globalId } : {}),
      ...(params.relationship ? { relationship: params.relationship } : {}),
      object: {
        url: params.url,
        title: params.title,
        ...(params.summary ? { summary: params.summary } : {}),
      },
      ...(params.applicationName || params.applicationType
        ? { application: { name: params.applicationName, type: params.applicationType } }
        : {}),
    };
  }

  async getRemoteIssueLinks(issueIdOrKey: string, globalId?: string) {
    return handleApiOperation(
      () => IssueService.getRemoteIssueLinks(issueIdOrKey, globalId),
      'Error getting remote issue links'
    );
  }

  async getRemoteIssueLink(issueIdOrKey: string, linkId: string) {
    return handleApiOperation(
      () => IssueService.getRemoteIssueLinkById(linkId, issueIdOrKey),
      'Error getting remote issue link'
    );
  }

  async createOrUpdateRemoteIssueLink(issueIdOrKey: string, params: {
    url: string;
    title: string;
    summary?: string;
    globalId?: string;
    relationship?: string;
    applicationName?: string;
    applicationType?: string;
  }) {
    return handleApiOperation(
      () => IssueService.createOrUpdateRemoteIssueLink(issueIdOrKey, this.buildRemoteIssueLinkBody(params)),
      'Error creating or updating remote issue link'
    );
  }

  async updateRemoteIssueLink(issueIdOrKey: string, linkId: string, params: {
    url: string;
    title: string;
    summary?: string;
    globalId?: string;
    relationship?: string;
    applicationName?: string;
    applicationType?: string;
  }) {
    const result = await handleApiOperation(
      () => IssueService.updateRemoteIssueLink(linkId, issueIdOrKey, this.buildRemoteIssueLinkBody(params)),
      'Error updating remote issue link'
    );
    if (result.success) {
      return { ...result, data: { updated: true, linkId } };
    }
    return result;
  }

  async deleteRemoteIssueLink(issueIdOrKey: string, linkId: string) {
    const result = await handleApiOperation(
      () => IssueService.deleteRemoteIssueLinkById(linkId, issueIdOrKey),
      'Error deleting remote issue link'
    );
    if (result.success) {
      return { ...result, data: { deleted: true, linkId } };
    }
    return result;
  }

  async deleteRemoteIssueLinkByGlobalId(issueIdOrKey: string, globalId: string) {
    const result = await handleApiOperation(
      () => IssueService.deleteRemoteIssueLinkByGlobalId(issueIdOrKey, globalId),
      'Error deleting remote issue link'
    );
    if (result.success) {
      return { ...result, data: { deleted: true, globalId } };
    }
    return result;
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

  async findGroups(query?: string, maxResults?: number, exclude?: string, userName?: string) {
    return handleApiOperation(
      () => GroupsService.findGroups(maxResults?.toString(), query, exclude, userName),
      'Error finding groups'
    );
  }

  async findUsersAndGroups(query: string, maxResults?: number, showAvatar?: boolean, issueTypeId?: string, projectId?: string, fieldId?: string) {
    return handleApiOperation(
      () => GroupuserpickerService.findUsersAndGroups(issueTypeId, maxResults?.toString(), query, showAvatar?.toString(), projectId, fieldId),
      'Error finding users and groups'
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

  async createIssues(issues: Array<{ projectId: string; summary: string; description: string; issueTypeId: string; customFields?: Record<string, any> }>) {
    return handleApiOperation(() => {
      const issueUpdates = issues.map((issue) => ({
        fields: {
          project: { key: issue.projectId },
          summary: issue.summary,
          description: issue.description,
          issuetype: { id: issue.issueTypeId },
          ...issue.customFields,
        },
      }));
      return IssueService.createIssues({ issueUpdates });
    }, 'Error bulk creating issues');
  }

  async archiveIssues(issueKeysOrJql: string, notifyUsers?: boolean) {
    return handleApiOperation(
      () => IssueService.archiveIssues(notifyUsers?.toString(), issueKeysOrJql),
      'Error bulk archiving issues'
    );
  }

  async archiveIssue(issueKey: string, notifyUsers?: boolean) {
    return handleApiOperation(
      () => IssueService.archiveIssue(issueKey, notifyUsers?.toString()),
      'Error archiving issue'
    );
  }

  async rankIssues(issueKeys: string[], rankBeforeIssue?: string, rankAfterIssue?: string, rankCustomFieldId?: number) {
    return handleApiOperation(
      () => IssueService.rankIssues({ issues: issueKeys, rankBeforeIssue, rankAfterIssue, rankCustomFieldId }),
      'Error ranking issues'
    );
  }

  async getBoards(maxResults?: number, name?: string, projectKeyOrId?: string, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getAllBoards(maxResults, name, projectKeyOrId, undefined, startAt),
      'Error getting boards'
    );
  }

  async getBoard(boardId: number) {
    return handleApiOperation(() => BoardService.getBoard(boardId), 'Error getting board');
  }

  async getBoardConfiguration(boardId: number) {
    return handleApiOperation(
      () => BoardService.getConfiguration(boardId),
      'Error getting board configuration'
    );
  }

  async getBoardIssues(boardId: number, jql?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getIssuesForBoard(boardId, undefined, jql, maxResults, undefined, undefined, startAt),
      'Error getting board issues'
    );
  }

  async getBoardSprints(boardId: number, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getAllSprints(boardId, maxResults, undefined, startAt),
      'Error getting board sprints'
    );
  }

  async getBoardVersions(boardId: number, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getAllVersions(boardId, maxResults, undefined, startAt),
      'Error getting board versions'
    );
  }

  async getBoardBacklogIssues(boardId: number, jql?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getIssuesForBacklog(boardId, undefined, jql, maxResults, undefined, undefined, startAt),
      'Error getting board backlog issues'
    );
  }

  async getBoardEpics(boardId: number, maxResults?: number, done?: boolean, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getEpics(boardId, maxResults, done?.toString(), startAt),
      'Error getting board epics'
    );
  }

  async getBoardIssuesWithoutEpic(boardId: number, jql?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getIssuesWithoutEpic(boardId, undefined, jql, maxResults, undefined, undefined, startAt),
      'Error getting board issues without an epic'
    );
  }

  async getBoardEpicIssues(boardId: number, epicId: number, jql?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => BoardService.getIssuesForEpic(epicId, boardId, undefined, jql, maxResults, undefined, undefined, startAt),
      'Error getting board epic issues'
    );
  }

  async moveIssuesToBacklog(issueKeys: string[]) {
    return handleApiOperation(
      () => BacklogService.moveIssuesToBacklog({ issues: issueKeys }),
      'Error moving issues to backlog'
    );
  }

  async createSprint(name: string, originBoardId: number, startDate?: string, endDate?: string, goal?: string) {
    return handleApiOperation(
      () => SprintService.createSprint({ name, originBoardId, startDate, endDate, goal }),
      'Error creating sprint'
    );
  }

  async getSprint(sprintId: number) {
    return handleApiOperation(() => SprintService.getSprint(sprintId), 'Error getting sprint');
  }

  async updateSprint(sprintId: number, name?: string, startDate?: string, endDate?: string, goal?: string, state?: string) {
    return handleApiOperation(
      () => SprintService.updateSprint(sprintId, { name, startDate, endDate, goal, state }),
      'Error updating sprint'
    );
  }

  async deleteSprint(sprintId: number) {
    return handleApiOperation(() => SprintService.deleteSprint(sprintId), 'Error deleting sprint');
  }

  async getSprintIssues(sprintId: number, jql?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => SprintService.getIssuesForSprint1(sprintId, undefined, jql, maxResults, undefined, undefined, startAt),
      'Error getting sprint issues'
    );
  }

  async moveIssuesToSprint(sprintId: number, issueKeys: string[]) {
    return handleApiOperation(
      () => SprintService.moveIssuesToSprint(sprintId, { issues: issueKeys }),
      'Error moving issues to sprint'
    );
  }

  async getEpic(epicIdOrKey: string) {
    return handleApiOperation(() => EpicService.getEpic(epicIdOrKey), 'Error getting epic');
  }

  async updateEpic(epicIdOrKey: string, name?: string, summary?: string, done?: boolean) {
    return handleApiOperation(
      () => EpicService.partiallyUpdateEpic(epicIdOrKey, { name, summary, done }),
      'Error updating epic'
    );
  }

  async getEpicIssues(epicIdOrKey: string, jql?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => EpicService.getIssuesForEpic1(epicIdOrKey, undefined, jql, maxResults, undefined, undefined, startAt),
      'Error getting epic issues'
    );
  }

  async moveIssuesToEpic(epicIdOrKey: string, issueKeys: string[]) {
    return handleApiOperation(
      () => EpicService.moveIssuesToEpic(epicIdOrKey, { issues: issueKeys }),
      'Error moving issues to epic'
    );
  }

  async rankEpic(epicIdOrKey: string, rankBeforeEpic?: string, rankAfterEpic?: string, rankCustomFieldId?: number) {
    return handleApiOperation(
      () => EpicService.rankEpics(epicIdOrKey, { rankBeforeEpic, rankAfterEpic, rankCustomFieldId }),
      'Error ranking epic'
    );
  }

  async getPermissionSchemes(expand?: string) {
    return handleApiOperation(
      () => PermissionschemeService.getPermissionSchemes(expand),
      'Error getting permission schemes'
    );
  }

  async getPermissionScheme(schemeId: number, expand?: string) {
    return handleApiOperation(
      () => PermissionschemeService.getPermissionScheme(schemeId, expand),
      'Error getting permission scheme'
    );
  }

  async createPermissionScheme(name: string, description?: string, permissions?: Array<{ permission: string; holderType: string; holderParameter?: string }>) {
    return handleApiOperation(
      () => PermissionschemeService.createPermissionScheme(undefined, {
        name,
        description,
        permissions: permissions?.map(({ permission, holderType, holderParameter }) => ({
          permission,
          holder: { type: holderType, parameter: holderParameter },
        })),
      }),
      'Error creating permission scheme'
    );
  }

  async updatePermissionScheme(schemeId: number, name?: string, description?: string, permissions?: Array<{ permission: string; holderType: string; holderParameter?: string }>) {
    return handleApiOperation(
      () => PermissionschemeService.updatePermissionScheme(schemeId, undefined, {
        name,
        description,
        permissions: permissions?.map(({ permission, holderType, holderParameter }) => ({
          permission,
          holder: { type: holderType, parameter: holderParameter },
        })),
      }),
      'Error updating permission scheme'
    );
  }

  async deletePermissionScheme(schemeId: number) {
    return handleApiOperation(
      () => PermissionschemeService.deletePermissionScheme(schemeId),
      'Error deleting permission scheme'
    );
  }

  async getPermissionSchemeGrants(schemeId: number, expand?: string) {
    return handleApiOperation(
      () => PermissionschemeService.getPermissionSchemeGrants(schemeId, expand),
      'Error getting permission scheme grants'
    );
  }

  async createPermissionGrant(schemeId: number, permission: string, holderType: string, holderParameter?: string) {
    return handleApiOperation(
      () => PermissionschemeService.createPermissionGrant(schemeId, undefined, {
        permission,
        holder: { type: holderType, parameter: holderParameter },
      }),
      'Error creating permission grant'
    );
  }

  async deletePermissionGrant(schemeId: number, permissionId: number) {
    return handleApiOperation(
      () => PermissionschemeService.deletePermissionSchemeEntity(permissionId, schemeId),
      'Error deleting permission grant'
    );
  }

  async getIssueTypeSchemes() {
    return handleApiOperation(
      () => IssuetypeschemeService.getAllIssueTypeSchemes(),
      'Error getting issue type schemes'
    );
  }

  async createIssueTypeScheme(name: string, description?: string, issueTypeIds?: string[], defaultIssueTypeId?: string) {
    return handleApiOperation(
      () => IssuetypeschemeService.createIssueTypeScheme({ name, description, issueTypeIds, defaultIssueTypeId }),
      'Error creating issue type scheme'
    );
  }

  async getIssueTypeScheme(schemeId: string) {
    return handleApiOperation(
      () => IssuetypeschemeService.getIssueTypeScheme(schemeId),
      'Error getting issue type scheme'
    );
  }

  async updateIssueTypeScheme(schemeId: string, name?: string, description?: string, issueTypeIds?: string[], defaultIssueTypeId?: string) {
    return handleApiOperation(
      () => IssuetypeschemeService.updateIssueTypeScheme(schemeId, { name, description, issueTypeIds, defaultIssueTypeId }),
      'Error updating issue type scheme'
    );
  }

  async deleteIssueTypeScheme(schemeId: string) {
    return handleApiOperation(
      () => IssuetypeschemeService.deleteIssueTypeScheme(schemeId),
      'Error deleting issue type scheme'
    );
  }

  async getIssueTypeSchemeProjects(schemeId: string, expand?: string) {
    return handleApiOperation(
      () => IssuetypeschemeService.getAssociatedProjects(schemeId, expand),
      'Error getting issue type scheme associated projects'
    );
  }

  async setIssueTypeSchemeProjects(schemeId: string, idsOrKeys: string[]) {
    return handleApiOperation(
      () => IssuetypeschemeService.setProjectAssociationsForScheme(schemeId, { idsOrKeys }),
      'Error setting issue type scheme project associations'
    );
  }

  async addIssueTypeSchemeProjects(schemeId: string, idsOrKeys: string[]) {
    return handleApiOperation(
      () => IssuetypeschemeService.addProjectAssociationsToScheme(schemeId, { idsOrKeys }),
      'Error adding issue type scheme project associations'
    );
  }

  async removeIssueTypeSchemeProjects(schemeId: string) {
    return handleApiOperation(
      () => IssuetypeschemeService.removeAllProjectAssociations(schemeId),
      'Error removing issue type scheme project associations'
    );
  }

  async removeIssueTypeSchemeProject(schemeId: string, projIdOrKey: string) {
    return handleApiOperation(
      () => IssuetypeschemeService.removeProjectAssociation(projIdOrKey, schemeId),
      'Error removing issue type scheme project association'
    );
  }

  async getPrioritySchemes(maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => PriorityschemesService.getPrioritySchemes(maxResults, startAt),
      'Error getting priority schemes'
    );
  }

  async createPriorityScheme(name: string, description?: string, defaultOptionId?: string, optionIds?: string[]) {
    return handleApiOperation(
      () => PriorityschemesService.createPriorityScheme({ name, description, defaultOptionId, optionIds }),
      'Error creating priority scheme'
    );
  }

  async getPriorityScheme(schemeId: number) {
    return handleApiOperation(
      () => PriorityschemesService.getPriorityScheme(schemeId),
      'Error getting priority scheme'
    );
  }

  async updatePriorityScheme(schemeId: number, name?: string, description?: string, defaultOptionId?: string, optionIds?: string[]) {
    return handleApiOperation(
      () => PriorityschemesService.updatePriorityScheme(schemeId, { name, description, defaultOptionId, optionIds }),
      'Error updating priority scheme'
    );
  }

  async deletePriorityScheme(schemeId: number) {
    return handleApiOperation(
      () => PriorityschemesService.deletePriorityScheme(schemeId),
      'Error deleting priority scheme'
    );
  }

  async getProjectCategories() {
    return handleApiOperation(
      () => ProjectCategoryService.getAllProjectCategories(),
      'Error getting project categories'
    );
  }

  async createProjectCategory(name?: string, description?: string) {
    return handleApiOperation(
      () => ProjectCategoryService.createProjectCategory({ name, description }),
      'Error creating project category'
    );
  }

  async getProjectCategory(id: number) {
    return handleApiOperation(
      () => ProjectCategoryService.getProjectCategoryById(id),
      'Error getting project category'
    );
  }

  async updateProjectCategory(id: number, name?: string, description?: string) {
    return handleApiOperation(
      () => ProjectCategoryService.updateProjectCategory(id, { name, description }),
      'Error updating project category'
    );
  }

  async deleteProjectCategory(id: number) {
    return handleApiOperation(
      () => ProjectCategoryService.removeProjectCategory(id),
      'Error deleting project category'
    );
  }

  async getRoleDefinitions() {
    return handleApiOperation(
      () => RoleService.getProjectRoles1(),
      'Error getting role definitions'
    );
  }

  async createRoleDefinition(name: string, description?: string) {
    return handleApiOperation(
      () => RoleService.createProjectRole({ name, description }),
      'Error creating role definition'
    );
  }

  async getRoleDefinition(id: number) {
    return handleApiOperation(
      () => RoleService.getProjectRolesById(id),
      'Error getting role definition'
    );
  }

  async updateRoleDefinition(id: number, name: string, description: string) {
    return handleApiOperation(
      () => RoleService.fullyUpdateProjectRole(id, { name, description }),
      'Error updating role definition'
    );
  }

  async partialUpdateRoleDefinition(id: number, name?: string, description?: string) {
    return handleApiOperation(
      () => RoleService.partialUpdateProjectRole(id, { name, description }),
      'Error partially updating role definition'
    );
  }

  async deleteRoleDefinition(id: number, swap?: number) {
    return handleApiOperation(
      () => RoleService.deleteProjectRole(id, swap),
      'Error deleting role definition'
    );
  }

  async getRoleDefinitionActors(id: number) {
    return handleApiOperation(
      () => RoleService.getProjectRoleActorsForRole(id),
      'Error getting role definition actors'
    );
  }

  async addRoleDefinitionActors(id: number, users?: string[], groups?: string[]) {
    return handleApiOperation(
      () => RoleService.addProjectRoleActorsToRole(id, {
        ...(users ? { user: users } : {}),
        ...(groups ? { group: groups } : {}),
      }),
      'Error adding role definition actors'
    );
  }

  async deleteRoleDefinitionActor(id: number, user?: string, group?: string) {
    return handleApiOperation(
      () => RoleService.deleteProjectRoleActorsFromRole(id, user, group),
      'Error deleting role definition actor'
    );
  }

  async getApplicationRoles() {
    return handleApiOperation(() => ApplicationroleService.getAll(), 'Error getting application roles');
  }

  async getApplicationRole(key: string) {
    return handleApiOperation(() => ApplicationroleService.get4(key), 'Error getting application role');
  }

  async getWorkflows(workflowName?: string) {
    return handleApiOperation(
      () => WorkflowService.getAllWorkflows(workflowName),
      'Error getting workflows'
    );
  }

  async getWorkflowScheme(schemeId: number, returnDraftIfExists?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.getById(schemeId, returnDraftIfExists),
      'Error getting workflow scheme'
    );
  }

  async getWorkflowSchemeDefault(schemeId: number, returnDraftIfExists?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.getDefault(schemeId, returnDraftIfExists),
      'Error getting workflow scheme default workflow'
    );
  }

  async getWorkflowSchemeIssueTypeMapping(schemeId: number, issueType: string, returnDraftIfExists?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.getIssueType(issueType, schemeId, returnDraftIfExists),
      'Error getting workflow scheme issue type mapping'
    );
  }

  async getWorkflowSchemeWorkflowMapping(schemeId: number, workflowName?: string, returnDraftIfExists?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.getWorkflow(schemeId, workflowName, returnDraftIfExists),
      'Error getting workflow scheme workflow mapping'
    );
  }

  async createWorkflowScheme(name?: string, description?: string, defaultWorkflow?: string, issueTypeMappings?: Record<string, string>) {
    return handleApiOperation(
      () => WorkflowschemeService.createScheme({ name, description, defaultWorkflow, issueTypeMappings }),
      'Error creating workflow scheme'
    );
  }

  async updateWorkflowScheme(schemeId: number, name?: string, description?: string, defaultWorkflow?: string, issueTypeMappings?: Record<string, string>, updateDraftIfNeeded?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.update(schemeId, { name, description, defaultWorkflow, issueTypeMappings, updateDraftIfNeeded }),
      'Error updating workflow scheme'
    );
  }

  async deleteWorkflowScheme(schemeId: number) {
    return handleApiOperation(
      () => WorkflowschemeService.deleteScheme(schemeId),
      'Error deleting workflow scheme'
    );
  }

  async setWorkflowSchemeIssueTypeMapping(schemeId: number, issueType: string, workflow: string, updateDraftIfNeeded?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.setIssueType(issueType, schemeId, { issueType, workflow, updateDraftIfNeeded }),
      'Error setting workflow scheme issue type mapping'
    );
  }

  async deleteWorkflowSchemeIssueTypeMapping(schemeId: number, issueType: string, updateDraftIfNeeded?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.deleteIssueType(issueType, schemeId, updateDraftIfNeeded),
      'Error deleting workflow scheme issue type mapping'
    );
  }

  async setWorkflowSchemeWorkflowMapping(schemeId: number, workflow: string, issueTypes?: string[], defaultMapping?: boolean, updateDraftIfNeeded?: boolean, workflowName?: string) {
    return handleApiOperation(
      () => WorkflowschemeService.updateWorkflowMapping(schemeId, { workflow, issueTypes, defaultMapping, updateDraftIfNeeded }, workflowName),
      'Error setting workflow scheme workflow mapping'
    );
  }

  async deleteWorkflowSchemeWorkflowMapping(schemeId: number, workflowName?: string, updateDraftIfNeeded?: boolean) {
    return handleApiOperation(
      () => WorkflowschemeService.deleteWorkflowMapping(schemeId, updateDraftIfNeeded, workflowName),
      'Error deleting workflow scheme workflow mapping'
    );
  }

  async getNotificationSchemes(expand?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => NotificationschemeService.getNotificationSchemes(expand, maxResults, startAt),
      'Error getting notification schemes'
    );
  }

  async getNotificationScheme(id: number, expand?: string) {
    return handleApiOperation(
      () => NotificationschemeService.getNotificationScheme(id, expand),
      'Error getting notification scheme'
    );
  }

  async getSecurityLevel(id: string) {
    return handleApiOperation(
      () => SecuritylevelService.getIssuesecuritylevel(id),
      'Error getting security level'
    );
  }

  async getIssueSecuritySchemes() {
    return handleApiOperation(
      () => IssuesecurityschemesService.getIssueSecuritySchemes(),
      'Error getting issue security schemes'
    );
  }

  async getIssueSecurityScheme(id: string) {
    return handleApiOperation(
      () => IssuesecurityschemesService.getIssueSecurityScheme(id),
      'Error getting issue security scheme'
    );
  }

  async getCustomFields(sortColumn?: string, types?: string[], search?: string, maxResults?: number, sortOrder?: string, screenIds?: string[], lastValueUpdate?: string, projectIds?: string[], startAt?: number) {
    return handleApiOperation(
      () => CustomFieldsService.getCustomFields(
        sortColumn,
        types?.join(','),
        search,
        maxResults !== undefined ? String(maxResults) : undefined,
        sortOrder,
        screenIds?.join(','),
        lastValueUpdate,
        projectIds?.join(','),
        startAt !== undefined ? String(startAt) : undefined
      ),
      'Error getting custom fields'
    );
  }

  async deleteCustomFields(ids: string[]) {
    return handleApiOperation(
      () => CustomFieldsService.bulkDeleteCustomFields(ids.join(',')),
      'Error deleting custom fields'
    );
  }

  async getCustomFieldOptions(customFieldId: string, maxResults?: number, issueTypeIds?: string[], query?: string, sortByOptionName?: boolean, useAllContexts?: boolean, page?: number, projectIds?: string[]) {
    return handleApiOperation(
      () => CustomFieldsService.getCustomFieldOptions(
        customFieldId,
        maxResults !== undefined ? String(maxResults) : undefined,
        issueTypeIds?.join(','),
        query,
        sortByOptionName !== undefined ? String(sortByOptionName) : undefined,
        useAllContexts !== undefined ? String(useAllContexts) : undefined,
        page !== undefined ? String(page) : undefined,
        projectIds?.join(',')
      ),
      'Error getting custom field options'
    );
  }

  async getCustomFieldOption(id: string) {
    return handleApiOperation(
      () => CustomFieldOptionService.getCustomFieldOption(id),
      'Error getting custom field option'
    );
  }

  async createCustomField(name: string, type: string, description?: string, searcherKey?: string, issueTypeIds?: string[], projectIds?: number[]) {
    return handleApiOperation(
      () => FieldService.createCustomField({ name, type, description, searcherKey, issueTypeIds, projectIds }),
      'Error creating custom field'
    );
  }

  async createUser(name: string, emailAddress: string, displayName?: string, password?: string, notification?: string) {
    return handleApiOperation(
      () => UserService.createUser({ name, emailAddress, displayName, password, notification }),
      'Error creating user'
    );
  }

  async removeUser(key?: string, username?: string) {
    return handleApiOperation(
      () => UserService.removeUser(key, username),
      'Error removing user'
    );
  }

  async changeUserPassword(password: string, currentPassword?: string, key?: string, username?: string) {
    return handleApiOperation(
      () => UserService.changeUserPassword({ password, currentPassword }, key, username),
      'Error changing user password'
    );
  }

  async validateUserAnonymization(userKey?: string, expand?: string) {
    return handleApiOperation(
      () => UserService.validateUserAnonymization(expand, userKey),
      'Error validating user anonymization'
    );
  }

  async scheduleUserAnonymization(userKey?: string, newOwnerKey?: string) {
    return handleApiOperation(
      () => UserService.scheduleUserAnonymization({ userKey, newOwnerKey }),
      'Error scheduling user anonymization'
    );
  }

  async getUserAnonymizationProgress(taskId?: number) {
    return handleApiOperation(
      () => UserService.getProgress1(taskId),
      'Error getting user anonymization progress'
    );
  }

  async getSystemAvatars(type: string) {
    return handleApiOperation(
      () => AvatarService.getAllSystemAvatars(type),
      'Error getting system avatars'
    );
  }

  async getAvatars(type: string, owningObjectId: string) {
    return handleApiOperation(
      () => UniversalAvatarService.getAvatars(type, owningObjectId),
      'Error getting avatars'
    );
  }

  async uploadTemporaryAvatar(type: string, owningObjectId: string, fileName: string, contentBase64: string) {
    return handleApiOperation(() => {
      const file = new File([Buffer.from(contentBase64, 'base64')], fileName);
      return UniversalAvatarService.storeTemporaryAvatarUsingMultiPart2(type, owningObjectId, { file } as unknown as FilePart);
    }, 'Error uploading temporary avatar');
  }

  async createAvatarFromTemporary(type: string, owningObjectId: string, cropperOffsetX?: number, cropperOffsetY?: number, cropperWidth?: number, needsCropping?: boolean, url?: string) {
    return handleApiOperation(
      () => UniversalAvatarService.createAvatarFromTemporary3(type, owningObjectId, {
        cropperOffsetX, cropperOffsetY, cropperWidth, needsCropping, url,
      }),
      'Error creating avatar from temporary'
    );
  }

  async deleteAvatar(id: number, type: string, owningObjectId: string) {
    return handleApiOperation(
      () => UniversalAvatarService.deleteAvatar1(id, type, owningObjectId),
      'Error deleting avatar'
    );
  }

  async getMyPermissions(projectKey?: string, projectId?: string, issueKey?: string, issueId?: string) {
    return handleApiOperation(
      () => MypermissionsService.getPermissions(issueId, projectKey, issueKey, projectId),
      'Error getting my permissions'
    );
  }

  async getAllPermissions() {
    return handleApiOperation(
      () => PermissionsService.getAllPermissions(),
      'Error getting all permissions'
    );
  }

  async getJqlAutocompleteData() {
    return handleApiOperation(
      () => JqlService.getAutoComplete(),
      'Error getting JQL autocomplete data'
    );
  }

  async getJqlFieldAutocomplete(fieldName?: string, fieldValue?: string, predicateName?: string, predicateValue?: string) {
    return handleApiOperation(
      () => JqlService.getFieldAutoCompleteForQueryString(predicateValue, predicateName, fieldName, fieldValue),
      'Error getting JQL field autocomplete suggestions'
    );
  }

  async validateProjectKey(key?: string) {
    return handleApiOperation(
      () => ProjectvalidateService.getProject1(key),
      'Error validating project key'
    );
  }

  async getMyPreference(key: string) {
    return handleApiOperation(() => MypreferencesService.getPreference(key), 'Error getting user preference');
  }

  async setMyPreference(key: string, value: string) {
    return handleApiOperation(
      () => MypreferencesService.setPreference(key, value),
      'Error setting user preference'
    );
  }

  async deleteMyPreference(key: string) {
    return handleApiOperation(
      () => MypreferencesService.removePreference(key),
      'Error deleting user preference'
    );
  }

  async getAllScreens(search?: string, expand?: string, maxResults?: number, startAt?: number) {
    return handleApiOperation(
      () => ScreensService.getAllScreens(
        search,
        expand,
        maxResults !== undefined ? String(maxResults) : undefined,
        startAt !== undefined ? String(startAt) : undefined
      ),
      'Error getting screens'
    );
  }

  async addFieldToDefaultScreen(fieldId: string) {
    return handleApiOperation(
      () => ScreensService.addFieldToDefaultScreen(fieldId),
      'Error adding field to default screen'
    );
  }

  async getScreenAvailableFields(screenId: number) {
    return handleApiOperation(
      () => ScreensService.getFieldsToAdd(screenId),
      'Error getting available fields for screen'
    );
  }

  async getScreenTabs(screenId: number, projectKey?: string) {
    return handleApiOperation(
      () => ScreensService.getAllTabs(screenId, projectKey),
      'Error getting screen tabs'
    );
  }

  async addScreenTab(screenId: number, name: string) {
    return handleApiOperation(
      () => ScreensService.addTab(screenId, { name }),
      'Error adding screen tab'
    );
  }

  async renameScreenTab(screenId: number, tabId: number, name: string) {
    return handleApiOperation(
      () => ScreensService.renameTab(tabId, screenId, { name }),
      'Error renaming screen tab'
    );
  }

  async deleteScreenTab(screenId: number, tabId: number) {
    return handleApiOperation(
      () => ScreensService.deleteTab(tabId, screenId),
      'Error deleting screen tab'
    );
  }

  async moveScreenTab(screenId: number, tabId: number, pos: number) {
    return handleApiOperation(
      () => ScreensService.moveTab(tabId, screenId, pos),
      'Error moving screen tab'
    );
  }

  async getScreenTabFields(screenId: number, tabId: number, projectKey?: string) {
    return handleApiOperation(
      () => ScreensService.getAllFields(tabId, screenId, projectKey),
      'Error getting screen tab fields'
    );
  }

  async addFieldToScreenTab(screenId: number, tabId: number, fieldId: string) {
    return handleApiOperation(
      () => ScreensService.addField(tabId, screenId, { fieldId }),
      'Error adding field to screen tab'
    );
  }

  async removeFieldFromScreenTab(screenId: number, tabId: number, fieldId: string) {
    return handleApiOperation(
      () => ScreensService.removeField(tabId, screenId, fieldId),
      'Error removing field from screen tab'
    );
  }

  async moveScreenTabField(screenId: number, tabId: number, fieldId: string, after?: string, position?: 'Earlier' | 'Later' | 'First' | 'Last') {
    return handleApiOperation(
      () => ScreensService.moveField(tabId, screenId, fieldId, { after, position: position as MoveFieldBean.position | undefined }),
      'Error moving screen tab field'
    );
  }

  async updateScreenTabFieldShowWhenEmpty(screenId: number, tabId: number, fieldId: string, showWhenEmpty: boolean) {
    return handleApiOperation(
      () => ScreensService.updateShowWhenEmptyIndicator(tabId, screenId, showWhenEmpty, fieldId),
      'Error updating screen tab field show-when-empty indicator'
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
  createProject: {
    key: z.string().describe("Unique project key (uppercase letters, e.g., TEST)"),
    name: z.string().describe("Name of the new project"),
    projectTypeKey: z.string().optional().describe("Project type key, e.g., 'software', 'business', or 'service_desk'"),
    projectTemplateKey: z.string().optional().describe("Project template key determining the default scheme set, e.g., 'com.pyxis.greenhopper.jira:gh-simplified-kanban-classic'"),
    description: z.string().optional().describe("Project description"),
    lead: z.string().optional().describe("Username of the project lead"),
    url: z.string().optional().describe("A link to information about this project, such as a documentation page"),
    assigneeType: z.enum(['PROJECT_LEAD', 'UNASSIGNED']).optional().describe("Default assignee when a new issue is created"),
    avatarId: z.number().optional().describe("ID of an existing avatar to use for the project"),
    issueSecurityScheme: z.number().optional().describe("ID of the issue security scheme to associate with the project"),
    permissionScheme: z.number().optional().describe("ID of the permission scheme to associate with the project"),
    notificationScheme: z.number().optional().describe("ID of the notification scheme to associate with the project"),
    categoryId: z.number().optional().describe("ID of the project category to assign the project to"),
    workflowSchemeId: z.number().optional().describe("ID of the workflow scheme to associate with the project")
  },
  updateProject: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)"),
    name: z.string().optional().describe("New name for the project"),
    key: z.string().optional().describe("New unique project key (uppercase letters)"),
    description: z.string().optional().describe("New project description"),
    lead: z.string().optional().describe("Username of the new project lead"),
    url: z.string().optional().describe("A link to information about this project, such as a documentation page"),
    assigneeType: z.enum(['PROJECT_LEAD', 'UNASSIGNED']).optional().describe("Default assignee when a new issue is created"),
    avatarId: z.number().optional().describe("ID of an existing avatar to use for the project"),
    issueSecurityScheme: z.number().optional().describe("ID of the issue security scheme to associate with the project"),
    permissionScheme: z.number().optional().describe("ID of the permission scheme to associate with the project"),
    notificationScheme: z.number().optional().describe("ID of the notification scheme to associate with the project"),
    categoryId: z.number().optional().describe("ID of the project category to assign the project to"),
    projectTypeKey: z.string().optional().describe("New project type key, e.g., 'software', 'business', or 'service_desk'"),
    expand: z.string().optional().describe("Comma-separated project sections to expand in the response, such as description, lead, or issueTypes")
  },
  deleteProject: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST). Deletion is irreversible.")
  },
  archiveProject: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST)")
  },
  restoreProject: {
    projectIdOrKey: z.string().describe("Project id or key (e.g., TEST) of a previously archived project")
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
  getAttachmentContent: {
    attachmentId: z.string().describe("Id of the attachment to download")
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
  getRemoteIssueLinks: {
    issueIdOrKey: z.string().describe("JIRA issue id or key (e.g., PROJ-123)"),
    globalId: z.string().optional().describe("Optional global id to filter to a single remote issue link")
  },
  getRemoteIssueLink: {
    issueIdOrKey: z.string().describe("JIRA issue id or key (e.g., PROJ-123)"),
    linkId: z.string().describe("Id of the remote issue link")
  },
  createOrUpdateRemoteIssueLink: {
    issueIdOrKey: z.string().describe("JIRA issue id or key (e.g., PROJ-123)"),
    url: z.string().describe("URL of the remote object being linked to (e.g., a Confluence page or external URL)"),
    title: z.string().describe("Title of the remote object, shown in the issue's remote links list"),
    summary: z.string().optional().describe("Optional short summary of the remote object"),
    globalId: z.string().optional().describe("Optional global id identifying this remote link. If a link with this globalId already exists on the issue, it is updated instead of creating a duplicate."),
    relationship: z.string().optional().describe("Optional description of the relationship between the issue and the remote object (e.g., 'mentioned in', 'documented by')"),
    applicationName: z.string().optional().describe("Optional name of the application hosting the remote object (e.g., 'My Confluence Instance')"),
    applicationType: z.string().optional().describe("Optional type of the application hosting the remote object (e.g., 'com.atlassian.confluence')")
  },
  updateRemoteIssueLink: {
    issueIdOrKey: z.string().describe("JIRA issue id or key (e.g., PROJ-123)"),
    linkId: z.string().describe("Id of the remote issue link to update"),
    url: z.string().describe("URL of the remote object being linked to"),
    title: z.string().describe("Title of the remote object"),
    summary: z.string().optional().describe("Optional short summary of the remote object"),
    globalId: z.string().optional().describe("Optional global id identifying this remote link"),
    relationship: z.string().optional().describe("Optional description of the relationship between the issue and the remote object"),
    applicationName: z.string().optional().describe("Optional name of the application hosting the remote object"),
    applicationType: z.string().optional().describe("Optional type of the application hosting the remote object")
  },
  deleteRemoteIssueLink: {
    issueIdOrKey: z.string().describe("JIRA issue id or key (e.g., PROJ-123)"),
    linkId: z.string().describe("Id of the remote issue link to delete")
  },
  deleteRemoteIssueLinkByGlobalId: {
    issueIdOrKey: z.string().describe("JIRA issue id or key (e.g., PROJ-123)"),
    globalId: z.string().describe("Global id of the remote issue link to delete")
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
  findGroups: {
    query: z.string().optional().describe("Substring to match group names against"),
    maxResults: z.number().optional().describe("Maximum number of matching groups to return"),
    exclude: z.string().optional().describe("Comma-separated group names to exclude from the results"),
    userName: z.string().optional().describe("Restrict results to groups containing this username, for context")
  },
  findUsersAndGroups: {
    query: z.string().describe("Substring matched against username, display name, email address, or group name"),
    maxResults: z.number().optional().describe("Maximum number of users to return (groups are not subject to this limit)"),
    showAvatar: z.boolean().optional().describe("Whether to include avatar URLs for matched users"),
    issueTypeId: z.string().optional().describe("Comma-separated issue type ids to further restrict the search"),
    projectId: z.string().optional().describe("Comma-separated project ids to further restrict the search"),
    fieldId: z.string().optional().describe("Id of the custom field this picker is being used for, e.g. for a custom user/group picker field")
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
  },
  createIssues: {
    issues: z.array(z.object({
      projectId: z.string().describe("Project key (despite the parameter name, e.g. TEST)"),
      summary: z.string().describe("Issue summary"),
      description: z.string().describe("Issue description in JIRA Wiki Markup"),
      issueTypeId: z.string().describe("Issue type id"),
      customFields: z.record(z.any()).optional().describe("Optional fields merged into this issue's create payload")
    })).describe("Issues to create in a single bulk request")
  },
  archiveIssues: {
    issueKeysOrJql: z.string().describe("Comma-separated issue keys, or a JQL query, selecting the issues to archive"),
    notifyUsers: z.boolean().optional().describe("Whether to send notifications for this change")
  },
  archiveIssue: {
    issueKey: z.string().describe("JIRA issue key (e.g., PROJ-123)"),
    notifyUsers: z.boolean().optional().describe("Whether to send notifications for this change")
  },
  rankIssues: {
    issueKeys: z.array(z.string()).describe("Issue keys to rank, in the desired order"),
    rankBeforeIssue: z.string().optional().describe("Rank the issues before this issue key"),
    rankAfterIssue: z.string().optional().describe("Rank the issues after this issue key"),
    rankCustomFieldId: z.number().optional().describe("Id of the custom 'Rank' field, if not the default")
  },
  getBoards: {
    maxResults: z.number().optional().describe("Maximum number of boards to return"),
    name: z.string().optional().describe("Filter boards by name"),
    projectKeyOrId: z.string().optional().describe("Filter boards by project key or id"),
    startAt: z.number().optional().describe("Index of the first board to return")
  },
  getBoard: {
    boardId: z.number().describe("Id of the Agile board")
  },
  getBoardConfiguration: {
    boardId: z.number().describe("Id of the Agile board")
  },
  getBoardIssues: {
    boardId: z.number().describe("Id of the Agile board"),
    jql: z.string().optional().describe("JQL query to further filter the board's issues"),
    maxResults: z.number().optional().describe("Maximum number of issues to return"),
    startAt: z.number().optional().describe("Index of the first issue to return")
  },
  getBoardSprints: {
    boardId: z.number().describe("Id of the Agile board"),
    maxResults: z.number().optional().describe("Maximum number of sprints to return"),
    startAt: z.number().optional().describe("Index of the first sprint to return")
  },
  getBoardVersions: {
    boardId: z.number().describe("Id of the Agile board"),
    maxResults: z.number().optional().describe("Maximum number of versions to return"),
    startAt: z.number().optional().describe("Index of the first version to return")
  },
  getBoardBacklogIssues: {
    boardId: z.number().describe("Id of the Agile board"),
    jql: z.string().optional().describe("JQL query to further filter the backlog"),
    maxResults: z.number().optional().describe("Maximum number of issues to return"),
    startAt: z.number().optional().describe("Index of the first issue to return")
  },
  getBoardEpics: {
    boardId: z.number().describe("Id of the Agile board"),
    maxResults: z.number().optional().describe("Maximum number of epics to return"),
    done: z.boolean().optional().describe("Filter epics by done status"),
    startAt: z.number().optional().describe("Index of the first epic to return")
  },
  getBoardIssuesWithoutEpic: {
    boardId: z.number().describe("Id of the Agile board"),
    jql: z.string().optional().describe("JQL query to further filter results"),
    maxResults: z.number().optional().describe("Maximum number of issues to return"),
    startAt: z.number().optional().describe("Index of the first issue to return")
  },
  getBoardEpicIssues: {
    boardId: z.number().describe("Id of the Agile board"),
    epicId: z.number().describe("Id of the epic. Use jira_getBoardEpics to find epic ids."),
    jql: z.string().optional().describe("JQL query to further filter results"),
    maxResults: z.number().optional().describe("Maximum number of issues to return"),
    startAt: z.number().optional().describe("Index of the first issue to return")
  },
  moveIssuesToBacklog: {
    issueKeys: z.array(z.string()).describe("Issue keys to move to the backlog (removes them from any sprint). At most 50 at a time.")
  },
  createSprint: {
    name: z.string().describe("Sprint name"),
    originBoardId: z.number().describe("Id of the board this sprint originates from"),
    startDate: z.string().optional().describe("Sprint start date (ISO datetime)"),
    endDate: z.string().optional().describe("Sprint end date (ISO datetime)"),
    goal: z.string().optional().describe("Sprint goal text")
  },
  getSprint: {
    sprintId: z.number().describe("Id of the sprint")
  },
  updateSprint: {
    sprintId: z.number().describe("Id of the sprint to update"),
    name: z.string().optional().describe("New sprint name"),
    startDate: z.string().optional().describe("New start date (ISO datetime)"),
    endDate: z.string().optional().describe("New end date (ISO datetime)"),
    goal: z.string().optional().describe("New sprint goal text"),
    state: z.enum(['future', 'active', 'closed']).optional().describe("New sprint state — set to 'active' to start the sprint or 'closed' to complete it")
  },
  deleteSprint: {
    sprintId: z.number().describe("Id of the sprint to delete")
  },
  getSprintIssues: {
    sprintId: z.number().describe("Id of the sprint"),
    jql: z.string().optional().describe("JQL query to further filter the sprint's issues"),
    maxResults: z.number().optional().describe("Maximum number of issues to return"),
    startAt: z.number().optional().describe("Index of the first issue to return")
  },
  moveIssuesToSprint: {
    sprintId: z.number().describe("Id of the target sprint"),
    issueKeys: z.array(z.string()).describe("Issue keys to move into this sprint. At most 50 at a time.")
  },
  getEpic: {
    epicIdOrKey: z.string().describe("Id or issue key of the epic")
  },
  updateEpic: {
    epicIdOrKey: z.string().describe("Id or issue key of the epic to update"),
    name: z.string().optional().describe("New epic name (the short label shown on boards)"),
    summary: z.string().optional().describe("New epic summary"),
    done: z.boolean().optional().describe("Whether the epic is done")
  },
  getEpicIssues: {
    epicIdOrKey: z.string().describe("Id or issue key of the epic"),
    jql: z.string().optional().describe("JQL query to further filter the epic's issues"),
    maxResults: z.number().optional().describe("Maximum number of issues to return"),
    startAt: z.number().optional().describe("Index of the first issue to return")
  },
  moveIssuesToEpic: {
    epicIdOrKey: z.string().describe("Id or issue key of the target epic"),
    issueKeys: z.array(z.string()).describe("Issue keys to move into this epic")
  },
  rankEpic: {
    epicIdOrKey: z.string().describe("Id or issue key of the epic to rank"),
    rankBeforeEpic: z.string().optional().describe("Rank this epic before the epic with this id/key"),
    rankAfterEpic: z.string().optional().describe("Rank this epic after the epic with this id/key"),
    rankCustomFieldId: z.number().optional().describe("Id of the custom 'Rank' field, if not the default")
  },
  getIssueTypeSchemes: {},
  createIssueTypeScheme: {
    name: z.string().describe("Name of the new issue type scheme"),
    description: z.string().optional().describe("Description of the new issue type scheme"),
    issueTypeIds: z.array(z.string()).optional().describe("Ids of the issue types to associate with the scheme"),
    defaultIssueTypeId: z.string().optional().describe("Id of the default issue type. Must be one of issueTypeIds.")
  },
  getIssueTypeScheme: {
    schemeId: z.string().describe("Id of the issue type scheme")
  },
  updateIssueTypeScheme: {
    schemeId: z.string().describe("Id of the issue type scheme to update"),
    name: z.string().optional().describe("New name for the scheme"),
    description: z.string().optional().describe("New description for the scheme"),
    issueTypeIds: z.array(z.string()).optional().describe("Replaces the issue types associated with the scheme"),
    defaultIssueTypeId: z.string().optional().describe("Id of the default issue type. Must be one of issueTypeIds.")
  },
  deleteIssueTypeScheme: {
    schemeId: z.string().describe("Id of the issue type scheme to delete")
  },
  getIssueTypeSchemeProjects: {
    schemeId: z.string().describe("Id of the issue type scheme"),
    expand: z.string().optional().describe("Comma-separated expansions for the returned projects")
  },
  setIssueTypeSchemeProjects: {
    schemeId: z.string().describe("Id of the issue type scheme whose project associations are being replaced"),
    idsOrKeys: z.array(z.string()).describe("Project ids or keys to associate with the scheme, replacing any existing associations")
  },
  addIssueTypeSchemeProjects: {
    schemeId: z.string().describe("Id of the issue type scheme whose project associations are being added to"),
    idsOrKeys: z.array(z.string()).describe("Project ids or keys to associate with the scheme, in addition to existing associations")
  },
  removeIssueTypeSchemeProjects: {
    schemeId: z.string().describe("Id of the issue type scheme whose project associations should all be removed")
  },
  removeIssueTypeSchemeProject: {
    schemeId: z.string().describe("Id of the issue type scheme"),
    projIdOrKey: z.string().describe("Id or key of the project to un-associate from the scheme")
  },
  getPrioritySchemes: {
    maxResults: z.number().optional().describe("Maximum number of priority schemes to return"),
    startAt: z.number().optional().describe("Index of the first priority scheme to return")
  },
  createPriorityScheme: {
    name: z.string().describe("Name of the new priority scheme"),
    description: z.string().optional().describe("Description of the new priority scheme"),
    defaultOptionId: z.string().optional().describe("Id of the priority to use as the scheme's default"),
    optionIds: z.array(z.string()).optional().describe("Ids of the priorities included in the scheme")
  },
  getPriorityScheme: {
    schemeId: z.number().describe("Id of the priority scheme")
  },
  updatePriorityScheme: {
    schemeId: z.number().describe("Id of the priority scheme to update"),
    name: z.string().optional().describe("New name for the scheme"),
    description: z.string().optional().describe("New description for the scheme"),
    defaultOptionId: z.string().optional().describe("Id of the priority to use as the scheme's default"),
    optionIds: z.array(z.string()).optional().describe("Replaces the priorities included in the scheme")
  },
  deletePriorityScheme: {
    schemeId: z.number().describe("Id of the priority scheme to delete")
  },
  getProjectCategories: {},
  createProjectCategory: {
    name: z.string().optional().describe("Name of the new project category"),
    description: z.string().optional().describe("Description of the new project category")
  },
  getProjectCategory: {
    id: z.number().describe("Id of the project category")
  },
  updateProjectCategory: {
    id: z.number().describe("Id of the project category to update"),
    name: z.string().optional().describe("New name for the project category"),
    description: z.string().optional().describe("New description for the project category")
  },
  deleteProjectCategory: {
    id: z.number().describe("Id of the project category to delete")
  },
  getRoleDefinitions: {},
  createRoleDefinition: {
    name: z.string().describe("Name of the new global role definition"),
    description: z.string().optional().describe("Description of the new global role definition")
  },
  getRoleDefinition: {
    id: z.number().describe("Id of the global role definition. Use jira_getRoleDefinitions to find role ids.")
  },
  updateRoleDefinition: {
    id: z.number().describe("Id of the global role definition to fully update"),
    name: z.string().describe("New name for the role definition"),
    description: z.string().describe("New description for the role definition")
  },
  partialUpdateRoleDefinition: {
    id: z.number().describe("Id of the global role definition to partially update"),
    name: z.string().optional().describe("New name for the role definition"),
    description: z.string().optional().describe("New description for the role definition")
  },
  deleteRoleDefinition: {
    id: z.number().describe("Id of the global role definition to delete"),
    swap: z.number().optional().describe("Id of another role definition to migrate existing usages to before deleting")
  },
  getRoleDefinitionActors: {
    id: z.number().describe("Id of the global role definition. Use jira_getRoleDefinitions to find role ids.")
  },
  addRoleDefinitionActors: {
    id: z.number().describe("Id of the global role definition. Use jira_getRoleDefinitions to find role ids."),
    users: z.array(z.string()).optional().describe("Usernames to add as default actors for this role"),
    groups: z.array(z.string()).optional().describe("Group names to add as default actors for this role")
  },
  deleteRoleDefinitionActor: {
    id: z.number().describe("Id of the global role definition. Use jira_getRoleDefinitions to find role ids."),
    user: z.string().optional().describe("Username of the default actor to remove"),
    group: z.string().optional().describe("Group name of the default actor to remove")
  },
  getPermissionSchemes: {
    expand: z.string().optional().describe("Comma-separated expansions, e.g. 'permissions' to include each scheme's permission grants")
  },
  getPermissionScheme: {
    schemeId: z.number().describe("Id of the permission scheme"),
    expand: z.string().optional().describe("Comma-separated expansions, e.g. 'permissions' to include the scheme's permission grants")
  },
  createPermissionScheme: {
    name: z.string().describe("Name of the new permission scheme"),
    description: z.string().optional().describe("Description of the new permission scheme"),
    permissions: z.array(z.object({
      permission: z.string().describe("Permission key, e.g. 'ADMINISTER_PROJECTS' or 'BROWSE_PROJECTS'"),
      holderType: z.string().describe("Type of the permission holder, e.g. 'group', 'projectRole', 'applicationRole', 'anyone', 'reporter', 'assignee'"),
      holderParameter: z.string().optional().describe("Holder-specific identifier, e.g. group name or project role id")
    })).optional().describe("Initial permission grants for the scheme")
  },
  updatePermissionScheme: {
    schemeId: z.number().describe("Id of the permission scheme to update"),
    name: z.string().optional().describe("New name for the scheme"),
    description: z.string().optional().describe("New description for the scheme"),
    permissions: z.array(z.object({
      permission: z.string().describe("Permission key, e.g. 'ADMINISTER_PROJECTS' or 'BROWSE_PROJECTS'"),
      holderType: z.string().describe("Type of the permission holder, e.g. 'group', 'projectRole', 'applicationRole', 'anyone', 'reporter', 'assignee'"),
      holderParameter: z.string().optional().describe("Holder-specific identifier, e.g. group name or project role id")
    })).optional().describe("Replaces all permission grants for the scheme. Omit to leave grants unchanged.")
  },
  deletePermissionScheme: {
    schemeId: z.number().describe("Id of the permission scheme to delete")
  },
  getPermissionSchemeGrants: {
    schemeId: z.number().describe("Id of the permission scheme"),
    expand: z.string().optional().describe("Comma-separated expansions for the returned grants")
  },
  createPermissionGrant: {
    schemeId: z.number().describe("Id of the permission scheme to add the grant to"),
    permission: z.string().describe("Permission key, e.g. 'ADMINISTER_PROJECTS' or 'BROWSE_PROJECTS'"),
    holderType: z.string().describe("Type of the permission holder, e.g. 'group', 'projectRole', 'applicationRole', 'anyone', 'reporter', 'assignee'"),
    holderParameter: z.string().optional().describe("Holder-specific identifier, e.g. group name or project role id")
  },
  deletePermissionGrant: {
    schemeId: z.number().describe("Id of the permission scheme"),
    permissionId: z.number().describe("Id of the permission grant to delete")
  },
  getApplicationRoles: {},
  getApplicationRole: {
    key: z.string().describe("Key of the application role, e.g. 'jira-software'. Use jira_getApplicationRoles to find valid keys.")
  },
  getWorkflows: {
    workflowName: z.string().optional().describe("Name of a specific workflow to return. Omit to return all workflows.")
  },
  getWorkflowScheme: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    returnDraftIfExists: z.boolean().optional().describe("Return the draft variant of the scheme if one exists")
  },
  getWorkflowSchemeDefault: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    returnDraftIfExists: z.boolean().optional().describe("Return the draft variant's default workflow if a draft exists")
  },
  getWorkflowSchemeIssueTypeMapping: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    issueType: z.string().describe("Id of the issue type to look up in the scheme's mapping"),
    returnDraftIfExists: z.boolean().optional().describe("Return the draft variant's mapping if a draft exists")
  },
  getWorkflowSchemeWorkflowMapping: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    workflowName: z.string().optional().describe("Name of a specific workflow to look up. Omit to return all workflow mappings."),
    returnDraftIfExists: z.boolean().optional().describe("Return the draft variant's mapping if a draft exists")
  },
  createWorkflowScheme: {
    name: z.string().optional().describe("Name of the new workflow scheme"),
    description: z.string().optional().describe("Description of the workflow scheme"),
    defaultWorkflow: z.string().optional().describe("Name of the workflow to use as the scheme's default"),
    issueTypeMappings: z.record(z.string(), z.string()).optional().describe("Map of issue type id to workflow name for issue types that should use a workflow other than the default")
  },
  updateWorkflowScheme: {
    schemeId: z.number().describe("Id of the workflow scheme to update"),
    name: z.string().optional().describe("New name for the workflow scheme"),
    description: z.string().optional().describe("New description for the workflow scheme"),
    defaultWorkflow: z.string().optional().describe("New default workflow name"),
    issueTypeMappings: z.record(z.string(), z.string()).optional().describe("Replacement map of issue type id to workflow name"),
    updateDraftIfNeeded: z.boolean().optional().describe("Create/update a draft instead of failing when the scheme is active and cannot be edited directly")
  },
  deleteWorkflowScheme: {
    schemeId: z.number().describe("Id of the workflow scheme to delete. The scheme must not be active (in use by a project).")
  },
  setWorkflowSchemeIssueTypeMapping: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    issueType: z.string().describe("Id of the issue type to map"),
    workflow: z.string().describe("Name of the workflow to map the issue type to"),
    updateDraftIfNeeded: z.boolean().optional().describe("Create/update a draft instead of failing when the scheme is active and cannot be edited directly")
  },
  deleteWorkflowSchemeIssueTypeMapping: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    issueType: z.string().describe("Id of the issue type mapping to remove"),
    updateDraftIfNeeded: z.boolean().optional().describe("Create/update a draft instead of failing when the scheme is active and cannot be edited directly")
  },
  setWorkflowSchemeWorkflowMapping: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    workflow: z.string().describe("Name of the workflow for this mapping"),
    issueTypes: z.array(z.string()).optional().describe("Issue type ids to associate with this workflow"),
    defaultMapping: z.boolean().optional().describe("Whether this mapping should become the scheme's default"),
    workflowName: z.string().optional().describe("Name of the existing workflow mapping to replace. Omit when adding a brand new mapping."),
    updateDraftIfNeeded: z.boolean().optional().describe("Create/update a draft instead of failing when the scheme is active and cannot be edited directly")
  },
  deleteWorkflowSchemeWorkflowMapping: {
    schemeId: z.number().describe("Id of the workflow scheme"),
    workflowName: z.string().optional().describe("Name of the workflow mapping to remove. Omit to remove the default workflow's mapping."),
    updateDraftIfNeeded: z.boolean().optional().describe("Create/update a draft instead of failing when the scheme is active and cannot be edited directly")
  },
  getNotificationSchemes: {
    expand: z.string().optional().describe("Comma-separated expansions, e.g. 'all,field,group,user,projectRole,notificationSchemeEvents'"),
    maxResults: z.number().optional().describe("Maximum number of notification schemes to return"),
    startAt: z.number().optional().describe("Index of the first notification scheme to return")
  },
  getNotificationScheme: {
    id: z.number().describe("Id of the notification scheme"),
    expand: z.string().optional().describe("Comma-separated expansions, e.g. 'all,field,group,user,projectRole,notificationSchemeEvents'")
  },
  getSecurityLevel: {
    id: z.string().describe("Id of the issue security level")
  },
  getIssueSecuritySchemes: {},
  getIssueSecurityScheme: {
    id: z.string().describe("Id of the issue security scheme")
  },
  getCustomFields: {
    sortColumn: z.string().optional().describe("Column to sort the returned custom fields by"),
    types: z.array(z.string()).optional().describe("Custom field type keys to filter by"),
    search: z.string().optional().describe("Query string used to search custom fields by name"),
    maxResults: z.number().optional().describe("Maximum number of custom fields to return"),
    sortOrder: z.string().optional().describe("Sort order, e.g. 'asc' or 'desc'"),
    screenIds: z.array(z.string()).optional().describe("Screen ids to filter custom fields by"),
    lastValueUpdate: z.string().optional().describe("Filter by the last value update"),
    projectIds: z.array(z.string()).optional().describe("Project ids to filter custom fields by"),
    startAt: z.number().optional().describe("Index of the first custom field to return")
  },
  deleteCustomFields: {
    ids: z.array(z.string()).describe("Ids of the custom fields to delete")
  },
  getCustomFieldOptions: {
    customFieldId: z.string().describe("Id of the custom field"),
    maxResults: z.number().optional().describe("Maximum number of options to return"),
    issueTypeIds: z.array(z.string()).optional().describe("Issue type ids to scope the returned options to"),
    query: z.string().optional().describe("Query string used to filter options"),
    sortByOptionName: z.boolean().optional().describe("Sort the returned options by their names"),
    useAllContexts: z.boolean().optional().describe("Return options regardless of context, project ids, or issue type ids"),
    page: z.number().optional().describe("Page of options to return"),
    projectIds: z.array(z.string()).optional().describe("Project ids to scope the returned options to")
  },
  getCustomFieldOption: {
    id: z.string().describe("Id of the custom field option")
  },
  createCustomField: {
    name: z.string().describe("Name of the new custom field"),
    type: z.string().describe("Custom field type key, e.g. 'com.atlassian.jira.plugin.system.customfieldtypes:textfield'"),
    description: z.string().optional().describe("Description of the new custom field"),
    searcherKey: z.string().optional().describe("Searcher key for the new custom field, e.g. 'com.atlassian.jira.plugin.system.customfieldtypes:textsearcher'"),
    issueTypeIds: z.array(z.string()).optional().describe("Issue type ids to scope the field to"),
    projectIds: z.array(z.number()).optional().describe("Project ids to scope the field to")
  },
  createUser: {
    name: z.string().describe("Username of the new user"),
    emailAddress: z.string().describe("Email address of the new user"),
    displayName: z.string().optional().describe("Display name of the new user"),
    password: z.string().optional().describe("Password for the new user. If omitted, a random password is generated."),
    notification: z.string().optional().describe("Whether to notify the new user by email, e.g. 'true' or 'false'")
  },
  removeUser: {
    key: z.string().optional().describe("Key of the user to remove"),
    username: z.string().optional().describe("Username of the user to remove. Provide either key or username.")
  },
  changeUserPassword: {
    password: z.string().describe("New password for the user"),
    currentPassword: z.string().optional().describe("Current password, required when changing your own password"),
    key: z.string().optional().describe("Key of the user whose password is being changed"),
    username: z.string().optional().describe("Username of the user whose password is being changed. Provide either key or username.")
  },
  validateUserAnonymization: {
    userKey: z.string().optional().describe("Key of the user to validate anonymization for"),
    expand: z.string().optional().describe("Comma-separated expansions for the validation response")
  },
  scheduleUserAnonymization: {
    userKey: z.string().optional().describe("Key of the user to anonymize"),
    newOwnerKey: z.string().optional().describe("Key of the user who will own the anonymization audit log entries")
  },
  getUserAnonymizationProgress: {
    taskId: z.number().optional().describe("Id of the anonymization task to check progress for")
  },
  getSystemAvatars: {
    type: z.string().describe("Avatar type, e.g. 'project', 'user', or 'issuetype'")
  },
  getAvatars: {
    type: z.string().describe("Avatar type, e.g. 'project', 'user', or 'issuetype'"),
    owningObjectId: z.string().describe("Id of the object that owns the avatars, e.g. a project id or username")
  },
  uploadTemporaryAvatar: {
    type: z.string().describe("Avatar type, e.g. 'project', 'user', or 'issuetype'"),
    owningObjectId: z.string().describe("Id of the object that will own the avatar, e.g. a project id or username"),
    fileName: z.string().describe("File name of the avatar image, including extension (e.g. 'avatar.png')"),
    contentBase64: z.string().describe("Avatar image content encoded as base64")
  },
  createAvatarFromTemporary: {
    type: z.string().describe("Avatar type, e.g. 'project', 'user', or 'issuetype'"),
    owningObjectId: z.string().describe("Id of the object that will own the avatar, e.g. a project id or username"),
    cropperOffsetX: z.number().optional().describe("Horizontal crop offset returned by jira_uploadTemporaryAvatar"),
    cropperOffsetY: z.number().optional().describe("Vertical crop offset returned by jira_uploadTemporaryAvatar"),
    cropperWidth: z.number().optional().describe("Crop width returned by jira_uploadTemporaryAvatar"),
    needsCropping: z.boolean().optional().describe("Whether the temporary avatar needs cropping"),
    url: z.string().optional().describe("Url of the temporary avatar returned by jira_uploadTemporaryAvatar")
  },
  deleteAvatar: {
    id: z.number().describe("Id of the avatar to delete"),
    type: z.string().describe("Avatar type, e.g. 'project', 'user', or 'issuetype'"),
    owningObjectId: z.string().describe("Id of the object that owns the avatar, e.g. a project id or username")
  },
  getMyPermissions: {
    projectKey: z.string().optional().describe("Key of the project to scope returned permissions for"),
    projectId: z.string().optional().describe("Id of the project to scope returned permissions for"),
    issueKey: z.string().optional().describe("Key of the issue to scope returned permissions for"),
    issueId: z.string().optional().describe("Id of the issue to scope returned permissions for")
  },
  getAllPermissions: {},
  getJqlAutocompleteData: {},
  getJqlFieldAutocomplete: {
    fieldName: z.string().optional().describe("JQL field name to get value suggestions for, e.g. 'assignee' or 'status'"),
    fieldValue: z.string().optional().describe("Partial value typed so far, used to filter the returned suggestions"),
    predicateName: z.string().optional().describe("Name of the JQL predicate being completed, e.g. 'in' or 'was'"),
    predicateValue: z.string().optional().describe("Partial predicate value typed so far, used to filter the returned suggestions")
  },
  validateProjectKey: {
    key: z.string().optional().describe("Candidate project key to validate before creating a new project, e.g. 'TEST'. Returns validation errors, if any; an empty result means the key is valid.")
  },
  getMyPreference: {
    key: z.string().describe("Preference key to look up for the current user")
  },
  setMyPreference: {
    key: z.string().describe("Preference key to set for the current user"),
    value: z.string().describe("Preference value to store")
  },
  deleteMyPreference: {
    key: z.string().describe("Preference key to remove for the current user")
  },
  getAllScreens: {
    search: z.string().optional().describe("Query string used to search screens by name"),
    expand: z.string().optional().describe("Comma-separated expansions for the returned screens"),
    maxResults: z.number().optional().describe("Maximum number of screens to return"),
    startAt: z.number().optional().describe("Index of the first screen to return")
  },
  addFieldToDefaultScreen: {
    fieldId: z.string().describe("Id of the field or custom field to add to the default screen's default tab")
  },
  getScreenAvailableFields: {
    screenId: z.number().describe("Id of the screen")
  },
  getScreenTabs: {
    screenId: z.number().describe("Id of the screen"),
    projectKey: z.string().optional().describe("Key of the project to scope the returned tabs to")
  },
  addScreenTab: {
    screenId: z.number().describe("Id of the screen to add the tab to"),
    name: z.string().describe("Name of the new tab")
  },
  renameScreenTab: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab to rename"),
    name: z.string().describe("New name for the tab")
  },
  deleteScreenTab: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab to delete. The screen must have at least one tab remaining.")
  },
  moveScreenTab: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab to move"),
    pos: z.number().describe("Zero-based position to move the tab to")
  },
  getScreenTabFields: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab"),
    projectKey: z.string().optional().describe("Key of the project to scope the returned fields to")
  },
  addFieldToScreenTab: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab to add the field to"),
    fieldId: z.string().describe("Id of the field or custom field to add")
  },
  removeFieldFromScreenTab: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab"),
    fieldId: z.string().describe("Id of the field to remove from the tab")
  },
  moveScreenTabField: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab"),
    fieldId: z.string().describe("Id of the field to move"),
    after: z.string().optional().describe("Id of the field to position this field after"),
    position: z.enum(['Earlier', 'Later', 'First', 'Last']).optional().describe("Relative position to move the field to within the tab")
  },
  updateScreenTabFieldShowWhenEmpty: {
    screenId: z.number().describe("Id of the screen"),
    tabId: z.number().describe("Id of the tab"),
    fieldId: z.string().describe("Id of the field"),
    showWhenEmpty: z.boolean().describe("Whether to show a 'no value' indicator for this field on the screen when it is empty")
  }
};
