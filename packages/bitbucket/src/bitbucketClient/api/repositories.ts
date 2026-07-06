import type { HttpClient } from 'datacenter-mcp-core';
import { route, pickBody } from 'datacenter-mcp-core';
import { restPage } from '../core/page.js';
import type { RestPage } from '../interface/index.js';
import { SettingsSchema, AutoDeclineSettingsSchema, AutoMergeRestrictedSettingsSchema, BranchSchema, ChangeSchema, CommentSchema, CommitSchema, DiffSchema, LabelSchema, PullRequestSchema, RefRestrictionSchema, RepositoryHookSchema, RepositoryPullRequestSettingsSchema, TagSchema, WebhookSchema, BranchCreateRequestSchema, CreateTagRequestSchema, BranchDeleteRequestSchema, MultipartFormDataSchema, AutoDeclineSettingsRequestSchema, AutoMergeSettingsRequestSchema } from '../models/index.js';
import type { Settings, AutoDeclineSettings, AutoMergeRestrictedSettings, Branch, Change, Comment, Commit, Diff, Label, PullRequest, RefRestriction, RepositoryHook, RepositoryPullRequestSettings, Tag, Webhook } from '../models/index.js';
import type { CreateBranch, CreateCommitComment, CreateRestrictions, CreateTagForRepository, CreateWebhook, DeleteAutoDeclineSettings, DeleteAutoMergeSettings, DeleteBranch, DeleteRestriction, DeleteWebhook, DisableHook, EditFile, EnableHook, FindWebhooks, GetAutoDeclineSettings, GetAutoMergeSettings, GetBranches, GetComments, GetCommit, GetCommitChanges, GetCommitPullRequests, GetCommits, GetCompareDiff, GetContent, GetDefaultBranch, GetPullRequestSettings, GetRepositoryHooks, GetRepositoryLabels, GetRestriction, GetRestrictions, GetSettings, GetTag, GetTags, GetWebhook, SetAutoDeclineSettings, SetAutoMergeSettings, SetSettings, StreamCompareChanges, StreamCommits, StreamDiff, StreamRaw, UpdatePullRequestSettings, UpdateWebhook } from '../parameters/index.js';

export function createBranch(client: HttpClient, params: CreateBranch): Promise<Branch> {
  return client.sendRequest({
    url: route`/branch-utils/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/branches`,
    method: 'POST',
    body: pickBody(params, BranchCreateRequestSchema),
    contentType: 'application/json',
    schema: BranchSchema,
  });
}

export function createComment(client: HttpClient, params: CreateCommitComment): Promise<Comment> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/comments`,
    method: 'POST',
    searchParams: { since: params.since },
    body: pickBody(params, CommentSchema),
    contentType: 'application/json',
    schema: CommentSchema,
  });
}

export function createRestrictions(client: HttpClient, params: CreateRestrictions): Promise<RefRestriction> {
  return client.sendRequest({
    url: route`/branch-permissions/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/restrictions`,
    method: 'POST',
    body: params.restrictions,
    contentType: 'application/vnd.atl.bitbucket.bulk+json',
    schema: RefRestrictionSchema,
  });
}

export function createTagForRepository(client: HttpClient, params: CreateTagForRepository): Promise<Tag> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/tags`,
    method: 'POST',
    body: pickBody(params, CreateTagRequestSchema),
    contentType: 'application/json',
    schema: TagSchema,
  });
}

export function createWebhook(client: HttpClient, params: CreateWebhook): Promise<Webhook> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/webhooks`,
    method: 'POST',
    body: pickBody(params, WebhookSchema),
    contentType: 'application/json',
    schema: WebhookSchema,
  });
}

export function deleteAutoDeclineSettings(client: HttpClient, params: DeleteAutoDeclineSettings): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/auto-decline`,
    method: 'DELETE',
  });
}

export function deleteAutoMergeSettings(client: HttpClient, params: DeleteAutoMergeSettings): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/auto-merge`,
    method: 'DELETE',
  });
}

export function deleteBranch(client: HttpClient, params: DeleteBranch): Promise<void> {
  return client.sendRequest({
    url: route`/branch-utils/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/branches`,
    method: 'DELETE',
    body: pickBody(params, BranchDeleteRequestSchema),
    contentType: 'application/json',
  });
}

export function deleteRestriction(client: HttpClient, params: DeleteRestriction): Promise<void> {
  return client.sendRequest({
    url: route`/branch-permissions/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/restrictions/${params.id}`,
    method: 'DELETE',
  });
}

export function deleteWebhook(client: HttpClient, params: DeleteWebhook): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/webhooks/${params.webhookId}`,
    method: 'DELETE',
  });
}

export function disableHook(client: HttpClient, params: DisableHook): Promise<RepositoryHook> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/hooks/${params.hookKey}/enabled`,
    method: 'DELETE',
    schema: RepositoryHookSchema,
  });
}

export function editFile(client: HttpClient, params: EditFile): Promise<Commit> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/browse/${params.path}`,
    method: 'PUT',
    formData: pickBody(params, MultipartFormDataSchema),
    schema: CommitSchema,
  });
}

export function enableHook(client: HttpClient, params: EnableHook): Promise<RepositoryHook> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/hooks/${params.hookKey}/enabled`,
    method: 'PUT',
    schema: RepositoryHookSchema,
  });
}

export function findWebhooks(client: HttpClient, params: FindWebhooks): Promise<RestPage<Webhook>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/webhooks`,
    method: 'GET',
    searchParams: { event: params.event, statistics: params.statistics },
    schema: restPage(WebhookSchema),
  });
}

export function getAutoDeclineSettings(client: HttpClient, params: GetAutoDeclineSettings): Promise<AutoDeclineSettings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/auto-decline`,
    method: 'GET',
    schema: AutoDeclineSettingsSchema,
  });
}

export function getAutoMergeSettings(client: HttpClient, params: GetAutoMergeSettings): Promise<AutoMergeRestrictedSettings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/auto-merge`,
    method: 'GET',
    schema: AutoMergeRestrictedSettingsSchema,
  });
}

export function getBranches(client: HttpClient, params: GetBranches): Promise<RestPage<Branch>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/branches`,
    method: 'GET',
    searchParams: { boostMatches: params.boostMatches, context: params.context, orderBy: params.orderBy, details: params.details, filterText: params.filterText, base: params.base, start: params.start, limit: params.limit },
    schema: restPage(BranchSchema),
  });
}

export function getComments(client: HttpClient, params: GetComments): Promise<RestPage<Comment>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/comments`,
    method: 'GET',
    searchParams: { path: params.path, since: params.since, start: params.start, limit: params.limit },
    schema: restPage(CommentSchema),
  });
}

export function getCommit(client: HttpClient, params: GetCommit): Promise<Commit> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}`,
    method: 'GET',
    searchParams: { path: params.path },
    schema: CommitSchema,
  });
}

export function getCommits(client: HttpClient, params: GetCommits): Promise<RestPage<Commit>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits`,
    method: 'GET',
    searchParams: { avatarScheme: params.avatarScheme, path: params.path, withCounts: params.withCounts, followRenames: params.followRenames, until: params.until, avatarSize: params.avatarSize, since: params.since, merges: params.merges, ignoreMissing: params.ignoreMissing, start: params.start, limit: params.limit },
    schema: restPage(CommitSchema),
  });
}

export function getContent(client: HttpClient, params: GetContent): Promise<unknown> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/browse/${params.path}`,
    method: 'GET',
    searchParams: { noContent: params.noContent, at: params.at, size: params.size, blame: params.blame, type: params.type },
  });
}

export function getDefaultBranch(client: HttpClient, params: GetDefaultBranch): Promise<Branch> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/branches/default`,
    method: 'GET',
    schema: BranchSchema,
  });
}

export function getPullRequestSettings(client: HttpClient, params: GetPullRequestSettings): Promise<RepositoryPullRequestSettings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/pull-requests`,
    method: 'GET',
    schema: RepositoryPullRequestSettingsSchema,
  });
}

export function getRepositoryHooks(client: HttpClient, params: GetRepositoryHooks): Promise<RestPage<RepositoryHook>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/hooks`,
    method: 'GET',
    searchParams: { type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RepositoryHookSchema),
  });
}

export function getRestriction(client: HttpClient, params: GetRestriction): Promise<RefRestriction> {
  return client.sendRequest({
    url: route`/branch-permissions/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/restrictions/${params.id}`,
    method: 'GET',
    schema: RefRestrictionSchema,
  });
}

export function getRestrictions(client: HttpClient, params: GetRestrictions): Promise<RestPage<RefRestriction>> {
  return client.sendRequest({
    url: route`/branch-permissions/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/restrictions`,
    method: 'GET',
    searchParams: { matcherType: params.matcherType, matcherId: params.matcherId, type: params.type, start: params.start, limit: params.limit },
    schema: restPage(RefRestrictionSchema),
  });
}

export function getSettings(client: HttpClient, params: GetSettings): Promise<Settings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/hooks/${params.hookKey}/settings`,
    method: 'GET',
    schema: SettingsSchema,
  });
}

export function getTag(client: HttpClient, params: GetTag): Promise<Tag> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/tags/${params.name}`,
    method: 'GET',
    schema: TagSchema,
  });
}

export function getTags(client: HttpClient, params: GetTags): Promise<RestPage<Tag>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/tags`,
    method: 'GET',
    searchParams: { orderBy: params.orderBy, filterText: params.filterText, start: params.start, limit: params.limit },
    schema: restPage(TagSchema),
  });
}

export function getWebhook(client: HttpClient, params: GetWebhook): Promise<Webhook> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/webhooks/${params.webhookId}`,
    method: 'GET',
    searchParams: { statistics: params.statistics },
    schema: WebhookSchema,
  });
}

export function setAutoDeclineSettings(client: HttpClient, params: SetAutoDeclineSettings): Promise<AutoDeclineSettings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/auto-decline`,
    method: 'PUT',
    body: pickBody(params, AutoDeclineSettingsRequestSchema),
    contentType: 'application/json',
    schema: AutoDeclineSettingsSchema,
  });
}

export function setAutoMergeSettings(client: HttpClient, params: SetAutoMergeSettings): Promise<AutoMergeRestrictedSettings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/auto-merge`,
    method: 'PUT',
    body: pickBody(params, AutoMergeSettingsRequestSchema),
    contentType: 'application/json',
    schema: AutoMergeRestrictedSettingsSchema,
  });
}

export function setSettings(client: HttpClient, params: SetSettings): Promise<Settings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/hooks/${params.hookKey}/settings`,
    method: 'PUT',
    body: pickBody(params, SettingsSchema),
    contentType: 'application/json',
    schema: SettingsSchema,
  });
}

export function streamChanges(client: HttpClient, params: StreamCompareChanges): Promise<RestPage<Change>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/compare/changes`,
    method: 'GET',
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(ChangeSchema),
  });
}

export function streamCommits(client: HttpClient, params: StreamCommits): Promise<RestPage<Commit>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/compare/commits`,
    method: 'GET',
    searchParams: { fromRepo: params.fromRepo, from: params.from, to: params.to, start: params.start, limit: params.limit },
    schema: restPage(CommitSchema),
  });
}

export function streamDiff(client: HttpClient, params: StreamDiff): Promise<Diff> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/diff/${params.path}`,
    method: 'GET',
    searchParams: { srcPath: params.srcPath, avatarSize: params.avatarSize, filter: params.filter, avatarScheme: params.avatarScheme, contextLines: params.contextLines, autoSrcPath: params.autoSrcPath, whitespace: params.whitespace, withComments: params.withComments, since: params.since },
    schema: DiffSchema,
  });
}

export function streamRaw(client: HttpClient, params: StreamRaw): Promise<string> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/raw/${params.path}`,
    method: 'GET',
    searchParams: { at: params.at, markup: params.markup, htmlEscape: params.htmlEscape, includeHeadingId: params.includeHeadingId, hardwrap: params.hardwrap },
  });
}

export function updatePullRequestSettings(client: HttpClient, params: UpdatePullRequestSettings): Promise<RepositoryPullRequestSettings> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/settings/pull-requests`,
    method: 'POST',
    body: pickBody(params, RepositoryPullRequestSettingsSchema),
    contentType: 'application/json',
    schema: RepositoryPullRequestSettingsSchema,
  });
}

export function updateWebhook(client: HttpClient, params: UpdateWebhook): Promise<Webhook> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/webhooks/${params.webhookId}`,
    method: 'PUT',
    body: pickBody(params, WebhookSchema),
    contentType: 'application/json',
    schema: WebhookSchema,
  });
}

export function getCommitChanges(client: HttpClient, params: GetCommitChanges): Promise<RestPage<Change>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/changes`,
    method: 'GET',
    searchParams: { since: params.since, start: params.start, limit: params.limit },
    schema: restPage(ChangeSchema),
  });
}

export function getCommitPullRequests(client: HttpClient, params: GetCommitPullRequests): Promise<RestPage<PullRequest>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/pull-requests`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(PullRequestSchema),
  });
}

export function getCompareDiff(client: HttpClient, params: GetCompareDiff): Promise<Diff> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/compare/diff`,
    method: 'GET',
    searchParams: {
      from: params.from,
      to: params.to,
      fromRepo: params.fromRepo,
      srcPath: params.srcPath,
      contextLines: params.contextLines,
      whitespace: params.whitespace,
    },
    schema: DiffSchema,
  });
}

export function getRepositoryLabels(client: HttpClient, params: GetRepositoryLabels): Promise<RestPage<Label>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/labels`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(LabelSchema),
  });
}
