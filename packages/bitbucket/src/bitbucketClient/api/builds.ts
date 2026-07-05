import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { RestBuildStatusSchema, RestInsightAnnotationsResponseSchema, RestInsightReportSchema, RestRequiredBuildConditionSchema } from '../models/index.js';
import type { RestBuildStatus, RestBuildStatusSetRequest, RestBulkAddInsightAnnotationRequest, RestInsightAnnotationsResponse, RestInsightReport, RestRequiredBuildCondition, RestRequiredBuildConditionSetRequest, RestSetInsightReportRequest } from '../models/index.js';

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/builds */
export interface Add {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  requestBody?: RestBuildStatusSetRequest;
}
export function add(client: HttpClient, params: Add): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/builds`,
    body: params.requestBody,
    mediaType: '*/*',
  });
}

/** POST /insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}/annotations */
export interface AddAnnotations {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
  requestBody?: RestBulkAddInsightAnnotationRequest;
}
export function addAnnotations(client: HttpClient, params: AddAnnotations): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}/annotations`,
    body: params.requestBody,
    mediaType: 'application/json',
  });
}

/** POST /required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/condition */
export interface CreateRequiredBuildsMergeCheck {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RestRequiredBuildConditionSetRequest;
}
export function createRequiredBuildsMergeCheck(client: HttpClient, params: CreateRequiredBuildsMergeCheck): Promise<RestRequiredBuildCondition> {
  return client.sendRequest({
    method: 'POST',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition`,
    body: params.requestBody,
    mediaType: '*/*',
    schema: RestRequiredBuildConditionSchema,
  });
}

/** DELETE /insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key} */
export interface DeleteACodeInsightsReport {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
}
export function deleteACodeInsightsReport(client: HttpClient, params: DeleteACodeInsightsReport): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}`,
  });
}

/** DELETE /insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}/annotations */
export interface DeleteAnnotations {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
  externalId?: string;
}
export function deleteAnnotations(client: HttpClient, params: DeleteAnnotations): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}/annotations`,
    searchParams: { externalId: params.externalId },
  });
}

/** DELETE /required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id} */
export interface DeleteRequiredBuildsMergeCheck {
  projectKey: string;
  id: number;
  repositorySlug: string;
}
export function deleteRequiredBuildsMergeCheck(client: HttpClient, params: DeleteRequiredBuildsMergeCheck): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/builds */
export interface Get {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
}
export function get(client: HttpClient, params: Get): Promise<RestBuildStatus> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/builds`,
    searchParams: { key: params.key },
    schema: RestBuildStatusSchema,
  });
}

/** GET /insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key} */
export interface GetACodeInsightsReport {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
}
export function getACodeInsightsReport(client: HttpClient, params: GetACodeInsightsReport): Promise<RestInsightReport> {
  return client.sendRequest({
    method: 'GET',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}`,
    schema: RestInsightReportSchema,
  });
}

/** GET /insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}/annotations */
export interface GetAnnotations {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
}
export function getAnnotations(client: HttpClient, params: GetAnnotations): Promise<RestInsightAnnotationsResponse> {
  return client.sendRequest({
    method: 'GET',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}/annotations`,
    schema: RestInsightAnnotationsResponseSchema,
  });
}

/** GET /build-status/latest/commits/{commitId} */
export interface GetBuildStatusStats {
  commitId: string;
  orderBy?: string;
  start?: number;
  limit?: number;
}
export function getBuildStatusStats(client: HttpClient, params: GetBuildStatusStats): Promise<RestPage<RestBuildStatus>> {
  return client.sendRequest({
    method: 'GET',
    url: `/build-status/latest/commits/${enc(params.commitId)}`,
    searchParams: { orderBy: params.orderBy, start: params.start, limit: params.limit },
    schema: restPage(RestBuildStatusSchema),
  });
}

/** GET /required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/conditions */
export interface GetPageOfRequiredBuildsMergeChecks {
  projectKey: string;
  repositorySlug: string;
  start?: number;
  limit?: number;
}
export function getPageOfRequiredBuildsMergeChecks(client: HttpClient, params: GetPageOfRequiredBuildsMergeChecks): Promise<RestPage<RestRequiredBuildCondition>> {
  return client.sendRequest({
    method: 'GET',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/conditions`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RestRequiredBuildConditionSchema),
  });
}

/** PUT /insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key} */
export interface SetACodeInsightsReport {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
  requestBody?: RestSetInsightReportRequest;
}
export function setACodeInsightsReport(client: HttpClient, params: SetACodeInsightsReport): Promise<RestInsightReport> {
  return client.sendRequest({
    method: 'PUT',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RestInsightReportSchema,
  });
}

/** PUT /required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id} */
export interface UpdateRequiredBuildsMergeCheck {
  projectKey: string;
  id: number;
  repositorySlug: string;
  requestBody?: RestRequiredBuildConditionSetRequest;
}
export function updateRequiredBuildsMergeCheck(client: HttpClient, params: UpdateRequiredBuildsMergeCheck): Promise<RestRequiredBuildCondition> {
  return client.sendRequest({
    method: 'PUT',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
    body: params.requestBody,
    mediaType: '*/*',
    schema: RestRequiredBuildConditionSchema,
  });
}
