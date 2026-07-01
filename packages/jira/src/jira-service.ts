import { z } from 'zod';
import { handleApiOperation, resolveOpenApiBase } from '@mrrefactoring/atlassian-dc-mcp-core';
import {
  AttachmentService,
  IssueLinkService,
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
} from './jira-client/index.js';
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
  }
};
