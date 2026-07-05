import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { BuildStatusSchema, InsightAnnotationsResponseSchema, InsightReportSchema, RequiredBuildConditionSchema } from '../models/index.js';
import type { BuildStatus, InsightAnnotationsResponse, InsightReport, RequiredBuildCondition } from '../models/index.js';
import type { Add, AddAnnotations, CreateRequiredBuildsMergeCheck, DeleteACodeInsightsReport, DeleteAnnotations, DeleteRequiredBuildsMergeCheck, GetBuildStatus, GetACodeInsightsReport, GetAnnotations, GetBuildStatusStats, GetPageOfRequiredBuildsMergeChecks, SetACodeInsightsReport, UpdateRequiredBuildsMergeCheck } from '../parameters/index.js';

export function add(client: HttpClient, params: Add): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/builds`,
    body: params.requestBody,
    mediaType: '*/*',
  });
}

export function addAnnotations(client: HttpClient, params: AddAnnotations): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}/annotations`,
    body: params.requestBody,
    mediaType: 'application/json',
  });
}

export function createRequiredBuildsMergeCheck(client: HttpClient, params: CreateRequiredBuildsMergeCheck): Promise<RequiredBuildCondition> {
  return client.sendRequest({
    method: 'POST',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition`,
    body: params.requestBody,
    mediaType: '*/*',
    schema: RequiredBuildConditionSchema,
  });
}

export function deleteACodeInsightsReport(client: HttpClient, params: DeleteACodeInsightsReport): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}`,
  });
}

export function deleteAnnotations(client: HttpClient, params: DeleteAnnotations): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}/annotations`,
    searchParams: { externalId: params.externalId },
  });
}

export function deleteRequiredBuildsMergeCheck(client: HttpClient, params: DeleteRequiredBuildsMergeCheck): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
  });
}

export function get(client: HttpClient, params: GetBuildStatus): Promise<BuildStatus> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/builds`,
    searchParams: { key: params.key },
    schema: BuildStatusSchema,
  });
}

export function getACodeInsightsReport(client: HttpClient, params: GetACodeInsightsReport): Promise<InsightReport> {
  return client.sendRequest({
    method: 'GET',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}`,
    schema: InsightReportSchema,
  });
}

export function getAnnotations(client: HttpClient, params: GetAnnotations): Promise<InsightAnnotationsResponse> {
  return client.sendRequest({
    method: 'GET',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}/annotations`,
    schema: InsightAnnotationsResponseSchema,
  });
}

export function getBuildStatusStats(client: HttpClient, params: GetBuildStatusStats): Promise<RestPage<BuildStatus>> {
  return client.sendRequest({
    method: 'GET',
    url: `/build-status/latest/commits/${enc(params.commitId)}`,
    searchParams: { orderBy: params.orderBy, start: params.start, limit: params.limit },
    schema: restPage(BuildStatusSchema),
  });
}

export function getPageOfRequiredBuildsMergeChecks(client: HttpClient, params: GetPageOfRequiredBuildsMergeChecks): Promise<RestPage<RequiredBuildCondition>> {
  return client.sendRequest({
    method: 'GET',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/conditions`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RequiredBuildConditionSchema),
  });
}

export function setACodeInsightsReport(client: HttpClient, params: SetACodeInsightsReport): Promise<InsightReport> {
  return client.sendRequest({
    method: 'PUT',
    url: `/insights/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/commits/${enc(params.commitId)}/reports/${enc(params.key)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: InsightReportSchema,
  });
}

export function updateRequiredBuildsMergeCheck(client: HttpClient, params: UpdateRequiredBuildsMergeCheck): Promise<RequiredBuildCondition> {
  return client.sendRequest({
    method: 'PUT',
    url: `/required-builds/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/condition/${enc(params.id)}`,
    body: params.requestBody,
    mediaType: '*/*',
    schema: RequiredBuildConditionSchema,
  });
}
