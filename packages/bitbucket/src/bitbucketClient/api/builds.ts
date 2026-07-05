import type { HttpClient } from '../core/types.js';
import { route, pickBody } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { BuildStatusSchema, InsightAnnotationsResponseSchema, InsightReportSchema, RequiredBuildConditionSchema, BuildStatusSetRequestSchema, BulkAddInsightAnnotationRequestSchema, RequiredBuildConditionSetRequestSchema, SetInsightReportRequestSchema } from '../models/index.js';
import type { BuildStatus, InsightAnnotationsResponse, InsightReport, RequiredBuildCondition } from '../models/index.js';
import type { Add, AddAnnotations, CreateRequiredBuildsMergeCheck, DeleteACodeInsightsReport, DeleteAnnotations, DeleteRequiredBuildsMergeCheck, GetBuildStatus, GetACodeInsightsReport, GetAnnotations, GetBuildStatusStats, GetPageOfRequiredBuildsMergeChecks, SetACodeInsightsReport, UpdateRequiredBuildsMergeCheck } from '../parameters/index.js';

export function add(client: HttpClient, params: Add): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/builds`,
    method: 'POST',
    body: pickBody(params, BuildStatusSetRequestSchema),
    contentType: '*/*',
  });
}

export function addAnnotations(client: HttpClient, params: AddAnnotations): Promise<void> {
  return client.sendRequest({
    url: route`/insights/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/reports/${params.key}/annotations`,
    method: 'POST',
    body: pickBody(params, BulkAddInsightAnnotationRequestSchema),
    contentType: 'application/json',
  });
}

export function createRequiredBuildsMergeCheck(client: HttpClient, params: CreateRequiredBuildsMergeCheck): Promise<RequiredBuildCondition> {
  return client.sendRequest({
    url: route`/required-builds/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/condition`,
    method: 'POST',
    body: pickBody(params, RequiredBuildConditionSetRequestSchema),
    contentType: '*/*',
    schema: RequiredBuildConditionSchema,
  });
}

export function deleteACodeInsightsReport(client: HttpClient, params: DeleteACodeInsightsReport): Promise<void> {
  return client.sendRequest({
    url: route`/insights/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/reports/${params.key}`,
    method: 'DELETE',
  });
}

export function deleteAnnotations(client: HttpClient, params: DeleteAnnotations): Promise<void> {
  return client.sendRequest({
    url: route`/insights/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/reports/${params.key}/annotations`,
    method: 'DELETE',
    searchParams: { externalId: params.externalId },
  });
}

export function deleteRequiredBuildsMergeCheck(client: HttpClient, params: DeleteRequiredBuildsMergeCheck): Promise<void> {
  return client.sendRequest({
    url: route`/required-builds/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/condition/${params.id}`,
    method: 'DELETE',
  });
}

export function get(client: HttpClient, params: GetBuildStatus): Promise<BuildStatus> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/builds`,
    method: 'GET',
    searchParams: { key: params.key },
    schema: BuildStatusSchema,
  });
}

export function getACodeInsightsReport(client: HttpClient, params: GetACodeInsightsReport): Promise<InsightReport> {
  return client.sendRequest({
    url: route`/insights/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/reports/${params.key}`,
    method: 'GET',
    schema: InsightReportSchema,
  });
}

export function getAnnotations(client: HttpClient, params: GetAnnotations): Promise<InsightAnnotationsResponse> {
  return client.sendRequest({
    url: route`/insights/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/reports/${params.key}/annotations`,
    method: 'GET',
    schema: InsightAnnotationsResponseSchema,
  });
}

export function getBuildStatusStats(client: HttpClient, params: GetBuildStatusStats): Promise<RestPage<BuildStatus>> {
  return client.sendRequest({
    url: route`/build-status/latest/commits/${params.commitId}`,
    method: 'GET',
    searchParams: { orderBy: params.orderBy, start: params.start, limit: params.limit },
    schema: restPage(BuildStatusSchema),
  });
}

export function getPageOfRequiredBuildsMergeChecks(client: HttpClient, params: GetPageOfRequiredBuildsMergeChecks): Promise<RestPage<RequiredBuildCondition>> {
  return client.sendRequest({
    url: route`/required-builds/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/conditions`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RequiredBuildConditionSchema),
  });
}

export function setACodeInsightsReport(client: HttpClient, params: SetACodeInsightsReport): Promise<InsightReport> {
  return client.sendRequest({
    url: route`/insights/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/commits/${params.commitId}/reports/${params.key}`,
    method: 'PUT',
    body: pickBody(params, SetInsightReportRequestSchema),
    contentType: 'application/json',
    schema: InsightReportSchema,
  });
}

export function updateRequiredBuildsMergeCheck(client: HttpClient, params: UpdateRequiredBuildsMergeCheck): Promise<RequiredBuildCondition> {
  return client.sendRequest({
    url: route`/required-builds/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/condition/${params.id}`,
    method: 'PUT',
    body: pickBody(params, RequiredBuildConditionSetRequestSchema),
    contentType: '*/*',
    schema: RequiredBuildConditionSchema,
  });
}
