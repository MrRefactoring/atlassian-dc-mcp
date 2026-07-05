import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { ExampleSettingsSchema, RestAutoDeclineSettingsSchema, RestAutoMergeRestrictedSettingsSchema, RestBranchSchema, RestChangeSchema, RestCommentSchema, RestCommitSchema, RestDiffSchema, RestRefRestrictionSchema, RestRepositoryHookSchema, RestRepositoryPullRequestSettingsSchema, RestTagSchema, RestWebhookSchema } from '../models/index.js';
import type { ExampleMultipartFormData, ExampleSettings, RestAutoDeclineSettings, RestAutoDeclineSettingsRequest, RestAutoMergeRestrictedSettings, RestAutoMergeSettingsRequest, RestBranch, RestBranchCreateRequest, RestBranchDeleteRequest, RestChange, RestComment, RestCommit, RestCreateTagRequest, RestDiff, RestRefRestriction, RestRepositoryHook, RestRepositoryPullRequestSettings, RestRestrictionRequest, RestTag, RestWebhook } from '../models/index.js';

/** POST /branch-utils/latest/projects/{projectKey}/repos/{repositorySlug}/branches */
export interface CreateBranch {
  projectKey: string;
  repositorySlug: string;
  requestBody: RestBranchCreateRequest;
}
export function createBranch(client: HttpClient, params: CreateBranch): Promise<RestBranch> {
  return client.sendRequest({
    method: 'POST',
    url: `/branch-utils/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestBranchSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments */
export interface CreateComment {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  since?: string;
  requestBody?: RestComment;
}
export function createComment(client: HttpClient, params: CreateComment): Promise<RestComment> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/comments`,
    searchParams: { since: params.since },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestCommentSchema,
  });
}

/** POST /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions */
export interface CreateRestrictions {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Array<RestRestrictionRequest>;
}
export function createRestrictions(client: HttpClient, params: CreateRestrictions): Promise<RestRefRestriction> {
  return client.sendRequest({
    method: 'POST',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions`,
    body: params.requestBody,
    mediaType: 'application/vnd.atl.bitbucket.bulk+json',
    schema: RestRefRestrictionSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/tags */
export interface CreateTagForRepository {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestCreateTagRequest;
}
export function createTagForRepository(client: HttpClient, params: CreateTagForRepository): Promise<RestTag> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestTagSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks */
export interface CreateWebhook {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestWebhook;
}
export function createWebhook(client: HttpClient, params: CreateWebhook): Promise<RestWebhook> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestWebhookSchema,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline */
export interface DeleteAutoDeclineSettings {
  projectKey: string;
  repositorySlug: string;
}
export function deleteAutoDeclineSettings(client: HttpClient, params: DeleteAutoDeclineSettings): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge */
export interface DeleteAutoMergeSettings {
  projectKey: string;
  repositorySlug: string;
}
export function deleteAutoMergeSettings(client: HttpClient, params: DeleteAutoMergeSettings): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
  });
}

/** DELETE /branch-utils/latest/projects/{projectKey}/repos/{repositorySlug}/branches */
export interface DeleteBranch {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestBranchDeleteRequest;
}
export function deleteBranch(client: HttpClient, params: DeleteBranch): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/branch-utils/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    body: params.requestBody,
    mediaType: 'application/json',
  });
}

/** DELETE /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions/{id} */
export interface DeleteRestriction {
  projectKey: string;
  id: string;
  repositorySlug: string;
}
export function deleteRestriction(client: HttpClient, params: DeleteRestriction): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions/${enc(params.id)}`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId} */
export interface DeleteWebhook {
  projectKey: string;
  webhookId: string;
  repositorySlug: string;
}
export function deleteWebhook(client: HttpClient, params: DeleteWebhook): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled */
export interface DisableHook {
  projectKey: string;
  hookKey: string;
  repositorySlug: string;
}
export function disableHook(client: HttpClient, params: DisableHook): Promise<RestRepositoryHook> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/enabled`,
    schema: RestRepositoryHookSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/browse/{path} */
export interface EditFile {
  path: string;
  projectKey: string;
  repositorySlug: string;
  formData?: ExampleMultipartFormData;
}
export function editFile(client: HttpClient, params: EditFile): Promise<RestCommit> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/browse/${enc(params.path)}`,
    formData: params.formData,
    schema: RestCommitSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled */
export interface EnableHook {
  projectKey: string;
  hookKey: string;
  repositorySlug: string;
  contentLength?: string;
}
export function enableHook(client: HttpClient, params: EnableHook): Promise<RestRepositoryHook> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/enabled`,
    schema: RestRepositoryHookSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks */
export interface FindWebhooks {
  projectKey: string;
  repositorySlug: string;
  event?: string;
  statistics?: boolean;
}
export function findWebhooks(client: HttpClient, params: FindWebhooks): Promise<RestPage<RestWebhook>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks`,
    searchParams: { event: params.event, statistics: params.statistics },
    schema: restPage(RestWebhookSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline */
export interface GetAutoDeclineSettings {
  projectKey: string;
  repositorySlug: string;
}
export function getAutoDeclineSettings(client: HttpClient, params: GetAutoDeclineSettings): Promise<RestAutoDeclineSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
    schema: RestAutoDeclineSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge */
export interface GetAutoMergeSettings {
  projectKey: string;
  repositorySlug: string;
}
export function getAutoMergeSettings(client: HttpClient, params: GetAutoMergeSettings): Promise<RestAutoMergeRestrictedSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
    schema: RestAutoMergeRestrictedSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/branches */
export interface GetBranches {
  projectKey: string;
  repositorySlug: string;
  boostMatches?: boolean;
  context?: string;
  orderBy?: 'ALPHABETICAL' | 'MODIFICATION';
  details?: boolean;
  filterText?: string;
  base?: string;
  start?: number;
  limit?: number;
}
export function getBranches(client: HttpClient, params: GetBranches): Promise<RestPage<RestBranch>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    searchParams: { boostMatches: params.boostMatches, context: params.context, orderBy: params.orderBy, details: params.details, filterText: params.filterText, base: params.base, start: params.start, limit: params.limit },
    schema: restPage(RestBranchSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments */
export interface GetComments {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  path?: string;
  since?: string;
  start?: number;
  limit?: number;
}
export function getComments(client: HttpClient, params: GetComments): Promise<RestPage<RestComment>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/comments`,
    searchParams: { path: params.path, since: params.since, start: params.start, limit: params.limit },
    schema: restPage(RestCommentSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId} */
export interface GetCommit {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  path?: string;
}
export function getCommit(client: HttpClient, params: GetCommit): Promise<RestCommit> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}`,
    searchParams: { path: params.path },
    schema: RestCommitSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits */
export interface GetCommits {
  projectKey: string;
  repositorySlug: string;
  avatarScheme?: string;
  path?: string;
  withCounts?: string;
  followRenames?: string;
  until?: string;
  avatarSize?: string;
  since?: string;
  merges?: string;
  ignoreMissing?: string;
  start?: number;
  limit?: number;
}
export function getCommits(client: HttpClient, params: GetCommits): Promise<RestPage<RestCommit>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits`,
    searchParams: { avatarScheme: params.avatarScheme, path: params.path, withCounts: params.withCounts, followRenames: params.followRenames, until: params.until, avatarSize: params.avatarSize, since: params.since, merges: params.merges, ignoreMissing: params.ignoreMissing, start: params.start, limit: params.limit },
    schema: restPage(RestCommitSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/browse/{path} */
export interface GetContent {
  path: string;
  projectKey: string;
  repositorySlug: string;
  noContent?: string;
  at?: string;
  size?: string;
  blame?: string;
  type?: string;
}
export function getContent(client: HttpClient, params: GetContent): Promise<unknown> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/browse/${enc(params.path)}`,
    searchParams: { noContent: params.noContent, at: params.at, size: params.size, blame: params.blame, type: params.type },
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/branches/default */
export interface GetDefaultBranch {
  projectKey: string;
  repositorySlug: string;
}
export function getDefaultBranch(client: HttpClient, params: GetDefaultBranch): Promise<RestBranch> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches/default`,
    schema: RestBranchSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests */
export interface GetPullRequestSettings {
  projectKey: string;
  repositorySlug: string;
}
export function getPullRequestSettings(client: HttpClient, params: GetPullRequestSettings): Promise<RestRepositoryPullRequestSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/pull-requests`,
    schema: RestRepositoryPullRequestSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks */
export interface GetRepositoryHooks {
  projectKey: string;
  repositorySlug: string;
  type?: 'PRE_RECEIVE' | 'POST_RECEIVE';
  start?: number;
  limit?: number;
}
export function getRepositoryHooks(client: HttpClient, params: GetRepositoryHooks): Promise<RestPage<RestRepositoryHook>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks`,
    searchParams: { type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RestRepositoryHookSchema),
  });
}

/** GET /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions/{id} */
export interface GetRestriction {
  projectKey: string;
  id: string;
  repositorySlug: string;
}
export function getRestriction(client: HttpClient, params: GetRestriction): Promise<RestRefRestriction> {
  return client.sendRequest({
    method: 'GET',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions/${enc(params.id)}`,
    schema: RestRefRestrictionSchema,
  });
}

/** GET /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions */
export interface GetRestrictions {
  projectKey: string;
  repositorySlug: string;
  matcherType?: 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
  matcherId?: string;
  type?: 'read-only' | 'no-deletes' | 'fast-forward-only' | 'pull-request-only' | 'no-creates';
  start?: number;
  limit?: number;
}
export function getRestrictions(client: HttpClient, params: GetRestrictions): Promise<RestPage<RestRefRestriction>> {
  return client.sendRequest({
    method: 'GET',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions`,
    searchParams: { matcherType: params.matcherType, matcherId: params.matcherId, type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RestRefRestrictionSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/settings */
export interface GetSettings {
  projectKey: string;
  hookKey: string;
  repositorySlug: string;
}
export function getSettings(client: HttpClient, params: GetSettings): Promise<ExampleSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/settings`,
    schema: ExampleSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/tags/{name} */
export interface GetTag {
  projectKey: string;
  name: string;
  repositorySlug: string;
}
export function getTag(client: HttpClient, params: GetTag): Promise<RestTag> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags/${enc(params.name)}`,
    schema: RestTagSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/tags */
export interface GetTags {
  projectKey: string;
  repositorySlug: string;
  orderBy?: string;
  filterText?: string;
  start?: number;
  limit?: number;
}
export function getTags(client: HttpClient, params: GetTags): Promise<RestPage<RestTag>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags`,
    searchParams: { orderBy: params.orderBy, filterText: params.filterText, start: params.start, limit: params.limit },
    schema: restPage(RestTagSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId} */
export interface GetWebhook {
  projectKey: string;
  webhookId: string;
  repositorySlug: string;
  statistics?: string;
}
export function getWebhook(client: HttpClient, params: GetWebhook): Promise<RestWebhook> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
    searchParams: { statistics: params.statistics },
    schema: RestWebhookSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline */
export interface SetAutoDeclineSettings {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestAutoDeclineSettingsRequest;
}
export function setAutoDeclineSettings(client: HttpClient, params: SetAutoDeclineSettings): Promise<RestAutoDeclineSettings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestAutoDeclineSettingsSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge */
export interface SetAutoMergeSettings {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestAutoMergeSettingsRequest;
}
export function setAutoMergeSettings(client: HttpClient, params: SetAutoMergeSettings): Promise<RestAutoMergeRestrictedSettings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestAutoMergeRestrictedSettingsSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/settings */
export interface SetSettings {
  projectKey: string;
  hookKey: string;
  repositorySlug: string;
  requestBody?: ExampleSettings;
}
export function setSettings(client: HttpClient, params: SetSettings): Promise<ExampleSettings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/settings`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: ExampleSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/changes */
export interface StreamChanges {
  projectKey: string;
  repositorySlug: string;
  fromRepo?: string;
  from?: string;
  to?: string;
  start?: number;
  limit?: number;
}
export function streamChanges(client: HttpClient, params: StreamChanges): Promise<RestPage<RestChange>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/compare/changes`,
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(RestChangeSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/commits */
export interface StreamCommits {
  projectKey: string;
  repositorySlug: string;
  fromRepo?: string;
  from?: string;
  to?: string;
  start?: number;
  limit?: number;
}
export function streamCommits(client: HttpClient, params: StreamCommits): Promise<RestPage<RestCommit>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/compare/commits`,
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(RestCommitSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/diff/{path} */
export interface StreamDiff {
  commitId: string;
  repositorySlug: string;
  path: string;
  projectKey: string;
  srcPath?: string;
  avatarSize?: string;
  filter?: string;
  avatarScheme?: string;
  contextLines?: string;
  autoSrcPath?: string;
  whitespace?: string;
  withComments?: string;
  since?: string;
}
export function streamDiff(client: HttpClient, params: StreamDiff): Promise<RestDiff> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/diff/${enc(params.path)}`,
    searchParams: { srcPath: params.srcPath, avatarSize: params.avatarSize, filter: params.filter, avatarScheme: params.avatarScheme, contextLines: params.contextLines, autoSrcPath: params.autoSrcPath, whitespace: params.whitespace, withComments: params.withComments, since: params.since },
    schema: RestDiffSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/raw/{path} */
export interface StreamRaw {
  path: string;
  projectKey: string;
  repositorySlug: string;
  at?: string;
  markup?: string;
  htmlEscape?: string;
  includeHeadingId?: string;
  hardwrap?: string;
}
export function streamRaw(client: HttpClient, params: StreamRaw): Promise<string> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/raw/${enc(params.path)}`,
    searchParams: { at: params.at, markup: params.markup, htmlEscape: params.htmlEscape, includeHeadingId: params.includeHeadingId, hardwrap: params.hardwrap },
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests */
export interface UpdatePullRequestSettings {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestRepositoryPullRequestSettings;
}
export function updatePullRequestSettings(client: HttpClient, params: UpdatePullRequestSettings): Promise<RestRepositoryPullRequestSettings> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/pull-requests`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestRepositoryPullRequestSettingsSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId} */
export interface UpdateWebhook {
  projectKey: string;
  webhookId: string;
  repositorySlug: string;
  requestBody?: RestWebhook;
}
export function updateWebhook(client: HttpClient, params: UpdateWebhook): Promise<RestWebhook> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestWebhookSchema,
  });
}
