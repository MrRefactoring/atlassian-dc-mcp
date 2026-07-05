import type { HttpClient } from '../core/types.js';
import { enc, pickBody } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { SettingsSchema, AutoDeclineSettingsSchema, AutoMergeRestrictedSettingsSchema, BranchSchema, ChangeSchema, CommentSchema, CommitSchema, DiffSchema, RefRestrictionSchema, RepositoryHookSchema, RepositoryPullRequestSettingsSchema, TagSchema, WebhookSchema, BranchCreateRequestSchema, CreateTagRequestSchema, BranchDeleteRequestSchema, MultipartFormDataSchema, AutoDeclineSettingsRequestSchema, AutoMergeSettingsRequestSchema } from '../models/index.js';
import type { Settings, AutoDeclineSettings, AutoMergeRestrictedSettings, Branch, Change, Comment, Commit, Diff, RefRestriction, RepositoryHook, RepositoryPullRequestSettings, Tag, Webhook } from '../models/index.js';
import type { CreateBranch, CreateCommitComment, CreateRestrictions, CreateTagForRepository, CreateWebhook, DeleteAutoDeclineSettings, DeleteAutoMergeSettings, DeleteBranch, DeleteRestriction, DeleteWebhook, DisableHook, EditFile, EnableHook, FindWebhooks, GetAutoDeclineSettings, GetAutoMergeSettings, GetBranches, GetComments, GetCommit, GetCommits, GetContent, GetDefaultBranch, GetPullRequestSettings, GetRepositoryHooks, GetRestriction, GetRestrictions, GetSettings, GetTag, GetTags, GetWebhook, SetAutoDeclineSettings, SetAutoMergeSettings, SetSettings, StreamCompareChanges, StreamCommits, StreamDiff, StreamRaw, UpdatePullRequestSettings, UpdateWebhook } from '../parameters/index.js';

export function createBranch(client: HttpClient, params: CreateBranch): Promise<Branch> {
  return client.sendRequest({
    method: 'POST',
    url: `/branch-utils/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    body: pickBody(params, BranchCreateRequestSchema),
    mediaType: 'application/json',
    schema: BranchSchema,
  });
}

export function createComment(client: HttpClient, params: CreateCommitComment): Promise<Comment> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/comments`,
    searchParams: { since: params.since },
    body: pickBody(params, CommentSchema),
    mediaType: 'application/json',
    schema: CommentSchema,
  });
}

export function createRestrictions(client: HttpClient, params: CreateRestrictions): Promise<RefRestriction> {
  return client.sendRequest({
    method: 'POST',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions`,
    body: params.restrictions,
    mediaType: 'application/vnd.atl.bitbucket.bulk+json',
    schema: RefRestrictionSchema,
  });
}

export function createTagForRepository(client: HttpClient, params: CreateTagForRepository): Promise<Tag> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags`,
    body: pickBody(params, CreateTagRequestSchema),
    mediaType: 'application/json',
    schema: TagSchema,
  });
}

export function createWebhook(client: HttpClient, params: CreateWebhook): Promise<Webhook> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks`,
    body: pickBody(params, WebhookSchema),
    mediaType: 'application/json',
    schema: WebhookSchema,
  });
}

export function deleteAutoDeclineSettings(client: HttpClient, params: DeleteAutoDeclineSettings): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
  });
}

export function deleteAutoMergeSettings(client: HttpClient, params: DeleteAutoMergeSettings): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
  });
}

export function deleteBranch(client: HttpClient, params: DeleteBranch): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/branch-utils/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    body: pickBody(params, BranchDeleteRequestSchema),
    mediaType: 'application/json',
  });
}

export function deleteRestriction(client: HttpClient, params: DeleteRestriction): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions/${enc(params.id)}`,
  });
}

export function deleteWebhook(client: HttpClient, params: DeleteWebhook): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
  });
}

export function disableHook(client: HttpClient, params: DisableHook): Promise<RepositoryHook> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/enabled`,
    schema: RepositoryHookSchema,
  });
}

export function editFile(client: HttpClient, params: EditFile): Promise<Commit> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/browse/${enc(params.path)}`,
    formData: pickBody(params, MultipartFormDataSchema),
    schema: CommitSchema,
  });
}

export function enableHook(client: HttpClient, params: EnableHook): Promise<RepositoryHook> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/enabled`,
    schema: RepositoryHookSchema,
  });
}

export function findWebhooks(client: HttpClient, params: FindWebhooks): Promise<RestPage<Webhook>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks`,
    searchParams: { event: params.event, statistics: params.statistics },
    schema: restPage(WebhookSchema),
  });
}

export function getAutoDeclineSettings(client: HttpClient, params: GetAutoDeclineSettings): Promise<AutoDeclineSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
    schema: AutoDeclineSettingsSchema,
  });
}

export function getAutoMergeSettings(client: HttpClient, params: GetAutoMergeSettings): Promise<AutoMergeRestrictedSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
    schema: AutoMergeRestrictedSettingsSchema,
  });
}

export function getBranches(client: HttpClient, params: GetBranches): Promise<RestPage<Branch>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches`,
    searchParams: { boostMatches: params.boostMatches, context: params.context, orderBy: params.orderBy, details: params.details, filterText: params.filterText, base: params.base, start: params.start, limit: params.limit },
    schema: restPage(BranchSchema),
  });
}

export function getComments(client: HttpClient, params: GetComments): Promise<RestPage<Comment>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/comments`,
    searchParams: { path: params.path, since: params.since, start: params.start, limit: params.limit },
    schema: restPage(CommentSchema),
  });
}

export function getCommit(client: HttpClient, params: GetCommit): Promise<Commit> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}`,
    searchParams: { path: params.path },
    schema: CommitSchema,
  });
}

export function getCommits(client: HttpClient, params: GetCommits): Promise<RestPage<Commit>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits`,
    searchParams: { avatarScheme: params.avatarScheme, path: params.path, withCounts: params.withCounts, followRenames: params.followRenames, until: params.until, avatarSize: params.avatarSize, since: params.since, merges: params.merges, ignoreMissing: params.ignoreMissing, start: params.start, limit: params.limit },
    schema: restPage(CommitSchema),
  });
}

export function getContent(client: HttpClient, params: GetContent): Promise<unknown> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/browse/${enc(params.path)}`,
    searchParams: { noContent: params.noContent, at: params.at, size: params.size, blame: params.blame, type: params.type },
  });
}

export function getDefaultBranch(client: HttpClient, params: GetDefaultBranch): Promise<Branch> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/branches/default`,
    schema: BranchSchema,
  });
}

export function getPullRequestSettings(client: HttpClient, params: GetPullRequestSettings): Promise<RepositoryPullRequestSettings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/pull-requests`,
    schema: RepositoryPullRequestSettingsSchema,
  });
}

export function getRepositoryHooks(client: HttpClient, params: GetRepositoryHooks): Promise<RestPage<RepositoryHook>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks`,
    searchParams: { type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RepositoryHookSchema),
  });
}

export function getRestriction(client: HttpClient, params: GetRestriction): Promise<RefRestriction> {
  return client.sendRequest({
    method: 'GET',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions/${enc(params.id)}`,
    schema: RefRestrictionSchema,
  });
}

export function getRestrictions(client: HttpClient, params: GetRestrictions): Promise<RestPage<RefRestriction>> {
  return client.sendRequest({
    method: 'GET',
    url: `/branch-permissions/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/restrictions`,
    searchParams: { matcherType: params.matcherType, matcherId: params.matcherId, type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RefRestrictionSchema),
  });
}

export function getSettings(client: HttpClient, params: GetSettings): Promise<Settings> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/settings`,
    schema: SettingsSchema,
  });
}

export function getTag(client: HttpClient, params: GetTag): Promise<Tag> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags/${enc(params.name)}`,
    schema: TagSchema,
  });
}

export function getTags(client: HttpClient, params: GetTags): Promise<RestPage<Tag>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/tags`,
    searchParams: { orderBy: params.orderBy, filterText: params.filterText, start: params.start, limit: params.limit },
    schema: restPage(TagSchema),
  });
}

export function getWebhook(client: HttpClient, params: GetWebhook): Promise<Webhook> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
    searchParams: { statistics: params.statistics },
    schema: WebhookSchema,
  });
}

export function setAutoDeclineSettings(client: HttpClient, params: SetAutoDeclineSettings): Promise<AutoDeclineSettings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-decline`,
    body: pickBody(params, AutoDeclineSettingsRequestSchema),
    mediaType: 'application/json',
    schema: AutoDeclineSettingsSchema,
  });
}

export function setAutoMergeSettings(client: HttpClient, params: SetAutoMergeSettings): Promise<AutoMergeRestrictedSettings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/auto-merge`,
    body: pickBody(params, AutoMergeSettingsRequestSchema),
    mediaType: 'application/json',
    schema: AutoMergeRestrictedSettingsSchema,
  });
}

export function setSettings(client: HttpClient, params: SetSettings): Promise<Settings> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/hooks/${enc(params.hookKey)}/settings`,
    body: pickBody(params, SettingsSchema),
    mediaType: 'application/json',
    schema: SettingsSchema,
  });
}

export function streamChanges(client: HttpClient, params: StreamCompareChanges): Promise<RestPage<Change>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/compare/changes`,
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(ChangeSchema),
  });
}

export function streamCommits(client: HttpClient, params: StreamCommits): Promise<RestPage<Commit>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/compare/commits`,
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(CommitSchema),
  });
}

export function streamDiff(client: HttpClient, params: StreamDiff): Promise<Diff> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/diff/${enc(params.path)}`,
    searchParams: { srcPath: params.srcPath, avatarSize: params.avatarSize, filter: params.filter, avatarScheme: params.avatarScheme, contextLines: params.contextLines, autoSrcPath: params.autoSrcPath, whitespace: params.whitespace, withComments: params.withComments, since: params.since },
    schema: DiffSchema,
  });
}

export function streamRaw(client: HttpClient, params: StreamRaw): Promise<string> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/raw/${enc(params.path)}`,
    searchParams: { at: params.at, markup: params.markup, htmlEscape: params.htmlEscape, includeHeadingId: params.includeHeadingId, hardwrap: params.hardwrap },
  });
}

export function updatePullRequestSettings(client: HttpClient, params: UpdatePullRequestSettings): Promise<RepositoryPullRequestSettings> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/settings/pull-requests`,
    body: pickBody(params, RepositoryPullRequestSettingsSchema),
    mediaType: 'application/json',
    schema: RepositoryPullRequestSettingsSchema,
  });
}

export function updateWebhook(client: HttpClient, params: UpdateWebhook): Promise<Webhook> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/webhooks/${enc(params.webhookId)}`,
    body: pickBody(params, WebhookSchema),
    mediaType: 'application/json',
    schema: WebhookSchema,
  });
}
