import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { z } from 'zod';
import { ChangeSchema, CommentSchema, PullRequestActivitySchema, PullRequestConditionSchema, PullRequestMergeabilitySchema, PullRequestParticipantSchema, PullRequestSchema } from '../models/index.js';
import type { Change, Comment, PullRequest, PullRequestActivity, PullRequestCondition, PullRequestMergeability, PullRequestParticipant } from '../models/index.js';
import type { ApplySuggestion, AssignParticipantRole, CanMerge, Create, CreatePullRequestComment, CreatePullRequestCondition, Decline, DeleteComment, DeletePullRequestCondition, GetPullRequest, GetActivities, GetPage, GetPullRequestConditions, GetReviewers, ListParticipants, Merge, Reopen, StreamPullRequestChanges, UnassignParticipantRole, Unwatch, Update, UpdateComment, UpdatePullRequestCondition, UpdateStatus, Watch } from '../parameters/index.js';

export function applySuggestion(client: HttpClient, params: ApplySuggestion): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments/${enc(params.commentId)}/apply-suggestion`,
    body: params.requestBody,
    mediaType: 'application/json',
  });
}

export function assignParticipantRole(client: HttpClient, params: AssignParticipantRole): Promise<PullRequestParticipant> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestParticipantSchema,
  });
}

export function canMerge(client: HttpClient, params: CanMerge): Promise<PullRequestMergeability> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/merge`,
    schema: PullRequestMergeabilitySchema,
  });
}

export function create(client: HttpClient, params: Create): Promise<PullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function createComment(client: HttpClient, params: CreatePullRequestComment): Promise<Comment> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: CommentSchema,
  });
}

export function createPullRequestCondition(client: HttpClient, params: CreatePullRequestCondition): Promise<PullRequestCondition> {
  return client.sendRequest({
    method: 'POST',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestConditionSchema,
  });
}

export function decline(client: HttpClient, params: Decline): Promise<PullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/decline`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function deleteComment(client: HttpClient, params: DeleteComment): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments/${enc(params.commentId)}`,
    searchParams: { version: params.version },
  });
}

export function deletePullRequestCondition(client: HttpClient, params: DeletePullRequestCondition): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
  });
}

export function get(client: HttpClient, params: GetPullRequest): Promise<PullRequest> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}`,
    schema: PullRequestSchema,
  });
}

export function getActivities(client: HttpClient, params: GetActivities): Promise<RestPage<PullRequestActivity>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/activities`,
    searchParams: { fromType: params.fromType, fromId: params.fromId, start: params.start, limit: params.limit },
    schema: restPage(PullRequestActivitySchema),
  });
}

export function getPage(client: HttpClient, params: GetPage): Promise<RestPage<PullRequest>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests`,
    searchParams: { withAttributes: params.withAttributes, at: params.at, withProperties: params.withProperties, draft: params.draft, filterText: params.filterText, state: params.state, order: params.order, direction: params.direction, start: params.start, limit: params.limit },
    schema: restPage(PullRequestSchema),
  });
}

export function getPullRequestConditions(client: HttpClient, params: GetPullRequestConditions): Promise<PullRequestCondition[]> {
  return client.sendRequest({
    method: 'GET',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/conditions`,
    schema: z.array(PullRequestConditionSchema),
  });
}

export function getReviewers(client: HttpClient, params: GetReviewers): Promise<PullRequestCondition[]> {
  return client.sendRequest({
    method: 'GET',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/reviewers`,
    searchParams: { targetRepoId: params.targetRepoId, sourceRepoId: params.sourceRepoId, sourceRefId: params.sourceRefId, targetRefId: params.targetRefId },
    schema: z.array(PullRequestConditionSchema),
  });
}

export function listParticipants(client: HttpClient, params: ListParticipants): Promise<RestPage<PullRequestParticipant>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(PullRequestParticipantSchema),
  });
}

export function merge(client: HttpClient, params: Merge): Promise<PullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/merge`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function reopen(client: HttpClient, params: Reopen): Promise<PullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/reopen`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function streamChanges(client: HttpClient, params: StreamPullRequestChanges): Promise<Change> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/changes`,
    searchParams: { sinceId: params.sinceId, changeScope: params.changeScope, untilId: params.untilId, withComments: params.withComments, start: params.start, limit: params.limit },
    schema: ChangeSchema,
  });
}

export function unassignParticipantRole(client: HttpClient, params: UnassignParticipantRole): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants/${enc(params.userSlug)}`,
  });
}

export function unwatch(client: HttpClient, params: Unwatch): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/watch`,
  });
}

export function update(client: HttpClient, params: Update): Promise<PullRequest> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function updateComment(client: HttpClient, params: UpdateComment): Promise<Comment> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments/${enc(params.commentId)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: CommentSchema,
  });
}

export function updatePullRequestCondition(client: HttpClient, params: UpdatePullRequestCondition): Promise<PullRequestCondition> {
  return client.sendRequest({
    method: 'PUT',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestConditionSchema,
  });
}

export function updateStatus(client: HttpClient, params: UpdateStatus): Promise<PullRequestParticipant> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants/${enc(params.userSlug)}`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: PullRequestParticipantSchema,
  });
}

export function watch(client: HttpClient, params: Watch): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/watch`,
  });
}
