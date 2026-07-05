import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { z } from 'zod';
import { RestChangeSchema, RestCommentSchema, RestPullRequestActivitySchema, RestPullRequestConditionSchema, RestPullRequestMergeabilitySchema, RestPullRequestParticipantSchema, RestPullRequestSchema } from '../models/index.js';
import type { RestApplicationUser, RestApplySuggestionRequest, RestChange, RestComment, RestDefaultReviewersRequest, RestPullRequest, RestPullRequestActivity, RestPullRequestAssignParticipantRoleRequest, RestPullRequestAssignStatusRequest, RestPullRequestCondition, RestPullRequestDeclineRequest, RestPullRequestMergeRequest, RestPullRequestMergeability, RestPullRequestParticipant, RestPullRequestReopenRequest, RestReviewerGroup } from '../models/index.js';

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments/{commentId}/apply-suggestion */
export interface ApplySuggestion {
  projectKey: string;
  commentId: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: RestApplySuggestionRequest;
}
export function applySuggestion(client: HttpClient, params: ApplySuggestion): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments/${enc(params.commentId)}/apply-suggestion`,
    body: params.requestBody,
    mediaType: 'application/json',
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants */
export interface AssignParticipantRole {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody: RestPullRequestAssignParticipantRoleRequest;
}
export function assignParticipantRole(client: HttpClient, params: AssignParticipantRole): Promise<RestPullRequestParticipant> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestParticipantSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge */
export interface CanMerge {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
}
export function canMerge(client: HttpClient, params: CanMerge): Promise<RestPullRequestMergeability> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/merge`,
    schema: RestPullRequestMergeabilitySchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests */
export interface Create {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestPullRequest;
}
export function create(client: HttpClient, params: Create): Promise<RestPullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments */
export interface CreateComment {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: RestComment;
}
export function createComment(client: HttpClient, params: CreateComment): Promise<RestComment> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestCommentSchema,
  });
}

/** POST /default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/condition */
export interface CreatePullRequestCondition {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestDefaultReviewersRequest;
}
export function createPullRequestCondition(client: HttpClient, params: CreatePullRequestCondition): Promise<RestPullRequestCondition> {
  return client.sendRequest({
    method: 'POST',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestConditionSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/decline */
export interface Decline {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
  requestBody?: RestPullRequestDeclineRequest;
}
export function decline(client: HttpClient, params: Decline): Promise<RestPullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/decline`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestSchema,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments/{commentId} */
export interface DeleteComment {
  projectKey: string;
  commentId: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
}
export function deleteComment(client: HttpClient, params: DeleteComment): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments/${enc(params.commentId)}`,
    searchParams: { version: params.version },
  });
}

/** DELETE /default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id} */
export interface DeletePullRequestCondition {
  projectKey: string;
  id: number;
  repositorySlug: string;
}
export function deletePullRequestCondition(client: HttpClient, params: DeletePullRequestCondition): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId} */
export interface Get {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
}
export function get(client: HttpClient, params: Get): Promise<RestPullRequest> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}`,
    schema: RestPullRequestSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/activities */
export interface GetActivities {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  fromType?: string;
  fromId?: string;
  start?: number;
  limit?: number;
}
export function getActivities(client: HttpClient, params: GetActivities): Promise<RestPage<RestPullRequestActivity>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/activities`,
    searchParams: { fromType: params.fromType, fromId: params.fromId, start: params.start, limit: params.limit },
    schema: restPage(RestPullRequestActivitySchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests */
export interface GetPage {
  projectKey: string;
  repositorySlug: string;
  withAttributes?: string;
  at?: string;
  withProperties?: string;
  draft?: string;
  filterText?: string;
  state?: string;
  order?: string;
  direction?: string;
  start?: number;
  limit?: number;
}
export function getPage(client: HttpClient, params: GetPage): Promise<RestPage<RestPullRequest>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests`,
    searchParams: { withAttributes: params.withAttributes, at: params.at, withProperties: params.withProperties, draft: params.draft, filterText: params.filterText, state: params.state, order: params.order, direction: params.direction, start: params.start, limit: params.limit },
    schema: restPage(RestPullRequestSchema),
  });
}

/** GET /default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/conditions */
export interface GetPullRequestConditions {
  projectKey: string;
  repositorySlug: string;
}
export function getPullRequestConditions(client: HttpClient, params: GetPullRequestConditions): Promise<RestPullRequestCondition[]> {
  return client.sendRequest({
    method: 'GET',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/conditions`,
    schema: z.array(RestPullRequestConditionSchema),
  });
}

/** GET /default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/reviewers */
export interface GetReviewers {
  projectKey: string;
  repositorySlug: string;
  targetRepoId?: string;
  sourceRepoId?: string;
  sourceRefId?: string;
  targetRefId?: string;
}
export function getReviewers(client: HttpClient, params: GetReviewers): Promise<RestPullRequestCondition[]> {
  return client.sendRequest({
    method: 'GET',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/reviewers`,
    searchParams: { targetRepoId: params.targetRepoId, sourceRepoId: params.sourceRepoId, sourceRefId: params.sourceRefId, targetRefId: params.targetRefId },
    schema: z.array(RestPullRequestConditionSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants */
export interface ListParticipants {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  start?: number;
  limit?: number;
}
export function listParticipants(client: HttpClient, params: ListParticipants): Promise<RestPage<RestPullRequestParticipant>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RestPullRequestParticipantSchema),
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge */
export interface Merge {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
  requestBody?: RestPullRequestMergeRequest;
}
export function merge(client: HttpClient, params: Merge): Promise<RestPullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/merge`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/reopen */
export interface Reopen {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
  requestBody?: RestPullRequestReopenRequest;
}
export function reopen(client: HttpClient, params: Reopen): Promise<RestPullRequest> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/reopen`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestSchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/changes */
export interface StreamChanges {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  sinceId?: string;
  changeScope?: string;
  untilId?: string;
  withComments?: string;
  start?: number;
  limit?: number;
}
export function streamChanges(client: HttpClient, params: StreamChanges): Promise<RestChange> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/changes`,
    searchParams: { sinceId: params.sinceId, changeScope: params.changeScope, untilId: params.untilId, withComments: params.withComments, start: params.start, limit: params.limit },
    schema: RestChangeSchema,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug} */
export interface UnassignParticipantRole {
  projectKey: string;
  userSlug: string;
  pullRequestId: string;
  repositorySlug: string;
}
export function unassignParticipantRole(client: HttpClient, params: UnassignParticipantRole): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants/${enc(params.userSlug)}`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/watch */
export interface Unwatch {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
}
export function unwatch(client: HttpClient, params: Unwatch): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/watch`,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId} */
export interface Update {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: RestPullRequest;
}
export function update(client: HttpClient, params: Update): Promise<RestPullRequest> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments/{commentId} */
export interface UpdateComment {
  projectKey: string;
  commentId: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: RestComment;
}
export function updateComment(client: HttpClient, params: UpdateComment): Promise<RestComment> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/comments/${enc(params.commentId)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestCommentSchema,
  });
}

/** PUT /default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id} */
export interface UpdatePullRequestCondition {
  projectKey: string;
  id: string;
  repositorySlug: string;
  requestBody?: {
    requiredApprovals?: number;
    reviewerGroups?: Array<RestReviewerGroup>;
    reviewers?: Array<RestApplicationUser>;
    sourceMatcher?: {
      displayId?: string;
      id?: string;
      type?: {
        id?: 'ANY_REF' | 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
        name?: string;
      };
    };
    targetMatcher?: {
      displayId?: string;
      id?: string;
      type?: {
        id?: 'ANY_REF' | 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
        name?: string;
      };
    };
  };
}
export function updatePullRequestCondition(client: HttpClient, params: UpdatePullRequestCondition): Promise<RestPullRequestCondition> {
  return client.sendRequest({
    method: 'PUT',
    url: `/default-reviewers/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestConditionSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug} */
export interface UpdateStatus {
  projectKey: string;
  userSlug: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody: RestPullRequestAssignStatusRequest;
  version?: string;
}
export function updateStatus(client: HttpClient, params: UpdateStatus): Promise<RestPullRequestParticipant> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/participants/${enc(params.userSlug)}`,
    searchParams: { version: params.version },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestPullRequestParticipantSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/watch */
export interface Watch {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
}
export function watch(client: HttpClient, params: Watch): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/pull-requests/${enc(params.pullRequestId)}/watch`,
  });
}
