import type { HttpClient } from 'datacenter-mcp-core';
import { route, pickBody } from 'datacenter-mcp-core';
import { restPage } from '../core/page.js';
import type { RestPage } from '../interface/index.js';
import { z } from 'zod';
import { ChangeSchema, CommentSchema, PullRequestActivitySchema, PullRequestConditionSchema, PullRequestMergeabilitySchema, PullRequestParticipantSchema, PullRequestSchema, ApplySuggestionRequestSchema, PullRequestAssignParticipantRoleRequestSchema, DefaultReviewersRequestSchema, PullRequestDeclineRequestSchema, PullRequestMergeRequestSchema, PullRequestReopenRequestSchema, PullRequestAssignStatusRequestSchema } from '../models/index.js';
import type { Change, Comment, PullRequest, PullRequestActivity, PullRequestCondition, PullRequestMergeability, PullRequestParticipant } from '../models/index.js';
import type { ApplySuggestion, AssignParticipantRole, CanMerge, Create, CreatePullRequestComment, CreatePullRequestCondition, Decline, DeleteComment, DeletePullRequestCondition, GetPullRequest, GetPullRequestBlockerComments, GetActivities, GetPage, GetPullRequestConditions, GetReviewers, ListParticipants, Merge, Reopen, StreamPullRequestChanges, UnassignParticipantRole, Unwatch, Update, UpdateComment, UpdatePullRequestCondition, UpdateStatus, Watch } from '../parameters/index.js';

export function applySuggestion(client: HttpClient, params: ApplySuggestion): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/comments/${params.commentId}/apply-suggestion`,
    method: 'POST',
    body: pickBody(params, ApplySuggestionRequestSchema),
    contentType: 'application/json',
  });
}

export function assignParticipantRole(client: HttpClient, params: AssignParticipantRole): Promise<PullRequestParticipant> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/participants`,
    method: 'POST',
    body: pickBody(params, PullRequestAssignParticipantRoleRequestSchema),
    contentType: 'application/json',
    schema: PullRequestParticipantSchema,
  });
}

export function canMerge(client: HttpClient, params: CanMerge): Promise<PullRequestMergeability> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/merge`,
    method: 'GET',
    schema: PullRequestMergeabilitySchema,
  });
}

export function create(client: HttpClient, params: Create): Promise<PullRequest> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests`,
    method: 'POST',
    body: pickBody(params, PullRequestSchema),
    contentType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function createComment(client: HttpClient, params: CreatePullRequestComment): Promise<Comment> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/comments`,
    method: 'POST',
    body: pickBody(params, CommentSchema),
    contentType: 'application/json',
    schema: CommentSchema,
  });
}

export function createPullRequestCondition(client: HttpClient, params: CreatePullRequestCondition): Promise<PullRequestCondition> {
  return client.sendRequest({
    url: route`/default-reviewers/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/condition`,
    method: 'POST',
    body: pickBody(params, DefaultReviewersRequestSchema),
    contentType: 'application/json',
    schema: PullRequestConditionSchema,
  });
}

export function decline(client: HttpClient, params: Decline): Promise<PullRequest> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/decline`,
    method: 'POST',
    searchParams: { version: params.version },
    body: pickBody(params, PullRequestDeclineRequestSchema.omit({ version: true })),
    contentType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function deleteComment(client: HttpClient, params: DeleteComment): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/comments/${params.commentId}`,
    method: 'DELETE',
    searchParams: { version: params.version },
  });
}

export function deletePullRequestCondition(client: HttpClient, params: DeletePullRequestCondition): Promise<void> {
  return client.sendRequest({
    url: route`/default-reviewers/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/condition/${params.id}`,
    method: 'DELETE',
  });
}

export function get(client: HttpClient, params: GetPullRequest): Promise<PullRequest> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}`,
    method: 'GET',
    schema: PullRequestSchema,
  });
}

export function getActivities(client: HttpClient, params: GetActivities): Promise<RestPage<PullRequestActivity>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/activities`,
    method: 'GET',
    searchParams: { fromType: params.fromType, fromId: params.fromId, start: params.start, limit: params.limit },
    schema: restPage(PullRequestActivitySchema),
  });
}

export function getPage(client: HttpClient, params: GetPage): Promise<RestPage<PullRequest>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests`,
    method: 'GET',
    searchParams: { withAttributes: params.withAttributes, at: params.at, withProperties: params.withProperties, draft: params.draft, filterText: params.filterText, state: params.state, order: params.order, direction: params.direction, start: params.start, limit: params.limit },
    schema: restPage(PullRequestSchema),
  });
}

export function getPullRequestConditions(client: HttpClient, params: GetPullRequestConditions): Promise<PullRequestCondition[]> {
  return client.sendRequest({
    url: route`/default-reviewers/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/conditions`,
    method: 'GET',
    schema: z.array(PullRequestConditionSchema),
  });
}

export function getReviewers(client: HttpClient, params: GetReviewers): Promise<PullRequestCondition[]> {
  return client.sendRequest({
    url: route`/default-reviewers/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/reviewers`,
    method: 'GET',
    searchParams: { targetRepoId: params.targetRepoId, sourceRepoId: params.sourceRepoId, sourceRefId: params.sourceRefId, targetRefId: params.targetRefId },
    schema: z.array(PullRequestConditionSchema),
  });
}

export function listParticipants(client: HttpClient, params: ListParticipants): Promise<RestPage<PullRequestParticipant>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/participants`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(PullRequestParticipantSchema),
  });
}

export function merge(client: HttpClient, params: Merge): Promise<PullRequest> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/merge`,
    method: 'POST',
    searchParams: { version: params.version },
    body: pickBody(params, PullRequestMergeRequestSchema.omit({ version: true })),
    contentType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function reopen(client: HttpClient, params: Reopen): Promise<PullRequest> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/reopen`,
    method: 'POST',
    searchParams: { version: params.version },
    body: pickBody(params, PullRequestReopenRequestSchema.omit({ version: true })),
    contentType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function streamChanges(client: HttpClient, params: StreamPullRequestChanges): Promise<Change> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/changes`,
    method: 'GET',
    searchParams: { sinceId: params.sinceId, changeScope: params.changeScope, untilId: params.untilId, withComments: params.withComments, start: params.start, limit: params.limit },
    schema: ChangeSchema,
  });
}

export function unassignParticipantRole(client: HttpClient, params: UnassignParticipantRole): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/participants/${params.userSlug}`,
    method: 'DELETE',
  });
}

export function unwatch(client: HttpClient, params: Unwatch): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/watch`,
    method: 'DELETE',
  });
}

export function update(client: HttpClient, params: Update): Promise<PullRequest> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}`,
    method: 'PUT',
    body: pickBody(params, PullRequestSchema),
    contentType: 'application/json',
    schema: PullRequestSchema,
  });
}

export function updateComment(client: HttpClient, params: UpdateComment): Promise<Comment> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/comments/${params.commentId}`,
    method: 'PUT',
    body: pickBody(params, CommentSchema),
    contentType: 'application/json',
    schema: CommentSchema,
  });
}

export function updatePullRequestCondition(client: HttpClient, params: UpdatePullRequestCondition): Promise<PullRequestCondition> {
  return client.sendRequest({
    url: route`/default-reviewers/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/condition/${params.id}`,
    method: 'PUT',
    body: pickBody(params, ['requiredApprovals', 'reviewerGroups', 'reviewers', 'sourceMatcher', 'targetMatcher']),
    contentType: 'application/json',
    schema: PullRequestConditionSchema,
  });
}

export function updateStatus(client: HttpClient, params: UpdateStatus): Promise<PullRequestParticipant> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/participants/${params.userSlug}`,
    method: 'PUT',
    searchParams: { version: params.version },
    body: pickBody(params, PullRequestAssignStatusRequestSchema),
    contentType: 'application/json',
    schema: PullRequestParticipantSchema,
  });
}

export function watch(client: HttpClient, params: Watch): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/watch`,
    method: 'POST',
  });
}

export function getBlockerComments(client: HttpClient, params: GetPullRequestBlockerComments): Promise<RestPage<Comment>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/pull-requests/${params.pullRequestId}/blocker-comments`,
    method: 'GET',
    searchParams: { count: params.count, start: params.start, limit: params.limit },
    schema: restPage(CommentSchema),
  });
}
