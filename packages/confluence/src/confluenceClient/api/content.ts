import { route, type HttpClient } from 'datacenter-mcp-core';
import type { Content } from '../models.js';

export function addContentWatcher(client: HttpClient, params: { contentId: string; key?: string; username?: string }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/user/watch/content/${params.contentId}`,
    searchParams: { key: params.key, username: params.username },
  });
}

export function addLabels(client: HttpClient, params: { id: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/content/${params.id}/label`,
    body: params.requestBody,
  });
}

export function byOperation(client: HttpClient, params: { id: string; expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/restriction/byOperation`,
    searchParams: { expand: params.expand },
  });
}

export function children(client: HttpClient, params: { id: string; expand?: string; limit?: string; start?: string; parentVersion?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/child`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start, parentVersion: params.parentVersion },
  });
}

export function childrenOfType(client: HttpClient, params: { id: string; type: string; expand?: string; limit?: string; start?: string; parentVersion?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/child/${params.type}`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start, parentVersion: params.parentVersion },
  });
}

export function commentsOfContent(client: HttpClient, params: { id: string; expand?: string; depth?: string; limit?: string; start?: string; location?: string; parentVersion?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/child/comment`,
    searchParams: { expand: params.expand, depth: params.depth, limit: params.limit, start: params.start, location: params.location, parentVersion: params.parentVersion },
  });
}

export function convert(client: HttpClient, params: { to: string; expand?: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/contentbody/convert/${params.to}`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
  });
}

export function create1(client: HttpClient, params: { id: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/content/${params.id}/property`,
    body: params.requestBody,
  });
}

export function createContent(client: HttpClient, params: { requestBody: Content; expand?: string; status?: string }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/content`,
    searchParams: { expand: params.expand, status: params.status },
    body: params.requestBody,
  });
}

export function delete2(client: HttpClient, params: { id: string; key: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/content/${params.id}/property/${params.key}`,
  });
}

export function delete3(client: HttpClient, params: { id: string; status?: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/content/${params.id}`,
    searchParams: { status: params.status },
  });
}

export function deleteContentHistory(client: HttpClient, params: { id: string; versionNumber: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/content/${params.id}/version/${params.versionNumber}`,
  });
}

export function deleteLabelWithQueryParam(client: HttpClient, params: { id: string; name?: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/content/${params.id}/label`,
    searchParams: { name: params.name },
  });
}

export function descendants(client: HttpClient, params: { id: string; expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/descendant`,
    searchParams: { expand: params.expand },
  });
}

export function descendantsOfType(client: HttpClient, params: { id: string; type: string; expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/descendant/${params.type}`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function findAll(client: HttpClient, params: { id: string; expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/property`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function findByKey(client: HttpClient, params: { id: string; key: string; expand?: string; limit?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/property/${params.key}`,
    searchParams: { expand: params.expand, limit: params.limit },
  });
}

export function forOperation(client: HttpClient, params: { operationKey: string; id: string; expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/restriction/byOperation/${params.operationKey}`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function getContentById(client: HttpClient, params: { id: string; expand?: string; version?: string; status?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}`,
    searchParams: { expand: params.expand, version: params.version, status: params.status },
  });
}

export function getHistory(client: HttpClient, params: { id: string; expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/history`,
    searchParams: { expand: params.expand },
  });
}

export function index(client: HttpClient, params: { contentId: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.contentId}/watchers`,
    searchParams: { limit: params.limit, start: params.start },
  });
}

export function isWatchingContent(client: HttpClient, params: { contentId: string; key?: string; username?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/user/watch/content/${params.contentId}`,
    searchParams: { key: params.key, username: params.username },
  });
}

export function labels(client: HttpClient, params: { id: string; prefix?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/label`,
    searchParams: { prefix: params.prefix, limit: params.limit, start: params.start },
  });
}

export function publishLegacyDraft(client: HttpClient, params: { draftId: string; expand?: string; status?: string; requestBody?: Content }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/content/blueprint/instance/${params.draftId}`,
    searchParams: { expand: params.expand, status: params.status },
    body: params.requestBody,
  });
}

export function publishSharedDraft(client: HttpClient, params: { draftId: string; expand?: string; status?: string; requestBody?: Content }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/content/blueprint/instance/${params.draftId}`,
    searchParams: { expand: params.expand, status: params.status },
    body: params.requestBody,
  });
}

export function recent(client: HttpClient, params: { limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/label/recent`,
    searchParams: { limit: params.limit, start: params.start },
  });
}

export function related(client: HttpClient, params: { labelName: string; start?: string; limit?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/label/${params.labelName}/related`,
    searchParams: { start: params.start, limit: params.limit },
  });
}

export function removeContentWatcher(client: HttpClient, params: { contentId: string; key?: string; username?: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/user/watch/content/${params.contentId}`,
    searchParams: { key: params.key, username: params.username },
  });
}

export function search1(client: HttpClient, params: { cqlcontext?: string; expand?: string; includeArchivedSpaces?: string; limit?: string; start?: string; excerpt?: string; cql?: string; requestBody?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/search`,
    searchParams: { cqlcontext: params.cqlcontext, expand: params.expand, includeArchivedSpaces: params.includeArchivedSpaces, limit: params.limit, start: params.start, excerpt: params.excerpt, cql: params.cql },
    body: params.requestBody,
  });
}

export function update1(client: HttpClient, params: { id: string; key: string; expand?: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/content/${params.id}/property/${params.key}`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
  });
}

export function update2(client: HttpClient, params: { contentId: string; requestBody: Content; asyncReconciliation?: boolean; conflictPolicy?: string; status?: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/content/${params.contentId}`,
    searchParams: { asyncReconciliation: params.asyncReconciliation, conflictPolicy: params.conflictPolicy, status: params.status },
    body: params.requestBody,
  });
}

export function updateRestrictions(client: HttpClient, params: { id: string; expand?: string; limit?: string; start?: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/content/${params.id}/restriction`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
    body: params.requestBody,
  });
}
