import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { SettingsSchema, AutoDeclineSettingsSchema, AutoMergeRestrictedSettingsSchema, BranchSchema, ChangeSchema, CommentSchema, CommitSchema, DiffSchema, RefRestrictionSchema, RepositoryHookSchema, RepositoryPullRequestSettingsSchema, TagSchema, WebhookSchema } from '../models/index.js';
import type { Settings, AutoDeclineSettings, AutoMergeRestrictedSettings, Branch, Change, Comment, Commit, Diff, RefRestriction, RepositoryHook, RepositoryPullRequestSettings, Tag, Webhook } from '../models/index.js';
import type { CreateBranch, CreateCommitComment, CreateRestrictions, CreateTagForRepository, CreateWebhook, DeleteAutoDeclineSettings, DeleteAutoMergeSettings, DeleteBranch, DeleteRestriction, DeleteWebhook, DisableHook, EditFile, EnableHook, FindWebhooks, GetAutoDeclineSettings, GetAutoMergeSettings, GetBranches, GetComments, GetCommit, GetCommits, GetContent, GetDefaultBranch, GetPullRequestSettings, GetRepositoryHooks, GetRestriction, GetRestrictions, GetSettings, GetTag, GetTags, GetWebhook, SetAutoDeclineSettings, SetAutoMergeSettings, SetSettings, StreamCompareChanges, StreamCommits, StreamDiff, StreamRaw, UpdatePullRequestSettings, UpdateWebhook } from '../parameters/index.js';

/** POST /branch-utils/latest/projects/{projectKey}/repos/{repositorySlug}/branches */
export function createBranch(client: HttpClient, params: CreateBranch): Promise<Branch> {
  return client.sendRequest({
    method: 'POST',
    url: `/branch-utils/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: BranchSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments */
export function createComment(client: HttpClient, params: CreateCommitComment): Promise<Comment> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/comments`,
    searchParams: { since: params.since },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: CommentSchema,
  });
}

/** POST /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions */
export function createRestrictions(client: HttpClient, params: CreateRestrictions): Promise<RefRestriction> {
  return client.sendRequest({
    method: 'POST',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions`,
    body: params.requestBody,
    mediaType: 'application/vnd.atl.bitbucket.bulk+json',
    schema: RefRestrictionSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/tags */
export function createTagForRepository(client: HttpClient, params: CreateTagForRepository): Promise<Tag> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: TagSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks */
export function createWebhook(client: HttpClient, params: CreateWebhook): Promise<Webhook> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: WebhookSchema,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline */
export function deleteAutoDeclineSettings(client: HttpClient, params: DeleteAutoDeclineSettings): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge */
export function deleteAutoMergeSettings(client: HttpClient, params: DeleteAutoMergeSettings): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
  });
}

/** DELETE /branch-utils/latest/projects/{projectKey}/repos/{repositorySlug}/branches */
export function deleteBranch(client: HttpClient, params: DeleteBranch): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/branch-utils/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    body: params.requestBody,
    mediaType: 'application/json',
  });
}

/** DELETE /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions/{id} */
export function deleteRestriction(client: HttpClient, params: DeleteRestriction): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions/${enc(params.id)}`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId} */
export function deleteWebhook(client: HttpClient, params: DeleteWebhook): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled */
export function disableHook(client: HttpClient, params: DisableHook): Promise<RepositoryHook> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/enabled`,
    schema: RepositoryHookSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/browse/{path} */
export function editFile(client: HttpClient, params: EditFile): Promise<Commit> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/browse/${enc(params.path)}`,
    formData: params.formData,
    schema: CommitSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled */
export function enableHook(client: HttpClient, params: EnableHook): Promise<RepositoryHook> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/enabled`,
    schema: RepositoryHookSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks */
export function findWebhooks(client: HttpClient, params: FindWebhooks): Promise<RestPage<Webhook>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks`,
    searchParams: { event: params.event, statistics: params.statistics },
    schema: restPage(WebhookSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline */
export function getAutoDeclineSettings(client: HttpClient, params: GetAutoDeclineSettings): Promise<AutoDeclineSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
    schema: AutoDeclineSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge */
export function getAutoMergeSettings(client: HttpClient, params: GetAutoMergeSettings): Promise<AutoMergeRestrictedSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
    schema: AutoMergeRestrictedSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/branches */
export function getBranches(client: HttpClient, params: GetBranches): Promise<RestPage<Branch>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    searchParams: { boostMatches: params.boostMatches, context: params.context, orderBy: params.orderBy, details: params.details, filterText: params.filterText, base: params.base, start: params.start, limit: params.limit },
    schema: restPage(BranchSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments */
export function getComments(client: HttpClient, params: GetComments): Promise<RestPage<Comment>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/comments`,
    searchParams: { path: params.path, since: params.since, start: params.start, limit: params.limit },
    schema: restPage(CommentSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId} */
export function getCommit(client: HttpClient, params: GetCommit): Promise<Commit> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}`,
    searchParams: { path: params.path },
    schema: CommitSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits */
export function getCommits(client: HttpClient, params: GetCommits): Promise<RestPage<Commit>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits`,
    searchParams: { avatarScheme: params.avatarScheme, path: params.path, withCounts: params.withCounts, followRenames: params.followRenames, until: params.until, avatarSize: params.avatarSize, since: params.since, merges: params.merges, ignoreMissing: params.ignoreMissing, start: params.start, limit: params.limit },
    schema: restPage(CommitSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/browse/{path} */
export function getContent(client: HttpClient, params: GetContent): Promise<unknown> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/browse/${enc(params.path)}`,
    searchParams: { noContent: params.noContent, at: params.at, size: params.size, blame: params.blame, type: params.type },
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/branches/default */
export function getDefaultBranch(client: HttpClient, params: GetDefaultBranch): Promise<Branch> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches/default`,
    schema: BranchSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests */
export function getPullRequestSettings(client: HttpClient, params: GetPullRequestSettings): Promise<RepositoryPullRequestSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/pull-requests`,
    schema: RepositoryPullRequestSettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks */
export function getRepositoryHooks(client: HttpClient, params: GetRepositoryHooks): Promise<RestPage<RepositoryHook>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks`,
    searchParams: { type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RepositoryHookSchema),
  });
}

/** GET /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions/{id} */
export function getRestriction(client: HttpClient, params: GetRestriction): Promise<RefRestriction> {
  return client.sendRequest({
    method: 'GET',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions/${enc(params.id)}`,
    schema: RefRestrictionSchema,
  });
}

/** GET /branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions */
export function getRestrictions(client: HttpClient, params: GetRestrictions): Promise<RestPage<RefRestriction>> {
  return client.sendRequest({
    method: 'GET',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions`,
    searchParams: { matcherType: params.matcherType, matcherId: params.matcherId, type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RefRestrictionSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/settings */
export function getSettings(client: HttpClient, params: GetSettings): Promise<Settings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/settings`,
    schema: SettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/tags/{name} */
export function getTag(client: HttpClient, params: GetTag): Promise<Tag> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags/${enc(params.name)}`,
    schema: TagSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/tags */
export function getTags(client: HttpClient, params: GetTags): Promise<RestPage<Tag>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags`,
    searchParams: { orderBy: params.orderBy, filterText: params.filterText, start: params.start, limit: params.limit },
    schema: restPage(TagSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId} */
export function getWebhook(client: HttpClient, params: GetWebhook): Promise<Webhook> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
    searchParams: { statistics: params.statistics },
    schema: WebhookSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline */
export function setAutoDeclineSettings(client: HttpClient, params: SetAutoDeclineSettings): Promise<AutoDeclineSettings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: AutoDeclineSettingsSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge */
export function setAutoMergeSettings(client: HttpClient, params: SetAutoMergeSettings): Promise<AutoMergeRestrictedSettings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: AutoMergeRestrictedSettingsSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/settings */
export function setSettings(client: HttpClient, params: SetSettings): Promise<Settings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/settings`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: SettingsSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/changes */
export function streamChanges(client: HttpClient, params: StreamCompareChanges): Promise<RestPage<Change>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/compare/changes`,
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(ChangeSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/commits */
export function streamCommits(client: HttpClient, params: StreamCommits): Promise<RestPage<Commit>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/compare/commits`,
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(CommitSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/diff/{path} */
export function streamDiff(client: HttpClient, params: StreamDiff): Promise<Diff> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/diff/${enc(params.path)}`,
    searchParams: { srcPath: params.srcPath, avatarSize: params.avatarSize, filter: params.filter, avatarScheme: params.avatarScheme, contextLines: params.contextLines, autoSrcPath: params.autoSrcPath, whitespace: params.whitespace, withComments: params.withComments, since: params.since },
    schema: DiffSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/raw/{path} */
export function streamRaw(client: HttpClient, params: StreamRaw): Promise<string> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/raw/${enc(params.path)}`,
    searchParams: { at: params.at, markup: params.markup, htmlEscape: params.htmlEscape, includeHeadingId: params.includeHeadingId, hardwrap: params.hardwrap },
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests */
export function updatePullRequestSettings(client: HttpClient, params: UpdatePullRequestSettings): Promise<RepositoryPullRequestSettings> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/pull-requests`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RepositoryPullRequestSettingsSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId} */
export function updateWebhook(client: HttpClient, params: UpdateWebhook): Promise<Webhook> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: WebhookSchema,
  });
}
