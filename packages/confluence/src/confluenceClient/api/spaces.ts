import { route, type HttpClient } from 'datacenter-mcp-core';

export function archive(client: HttpClient, params: { spaceKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/archive`,
  });
}

export function contents(client: HttpClient, params: { spaceKey: string; expand?: string; depth?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/content`,
    searchParams: { expand: params.expand, depth: params.depth, limit: params.limit, start: params.start },
  });
}

export function contentsWithType1(client: HttpClient, params: { spaceKey: string; type: string; expand?: string; depth?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/content/${params.type}`,
    searchParams: { expand: params.expand, depth: params.depth, limit: params.limit, start: params.start },
  });
}

export function create3(client: HttpClient, params: { spaceKey: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/space/${params.spaceKey}/property`,
    body: params.requestBody,
  });
}

export function createPrivateSpace(client: HttpClient, params: { requestBody: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/space/_private`,
    body: params.requestBody,
  });
}

export function createSpace(client: HttpClient, params: { requestBody: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/space`,
    body: params.requestBody,
  });
}

export function delete4(client: HttpClient, params: { spaceKey: string; key: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/space/${params.spaceKey}/property/${params.key}`,
  });
}

export function delete5(client: HttpClient, params: { spaceKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/space/${params.spaceKey}`,
  });
}

export function get(client: HttpClient, params: { spaceKey: string; key: string; expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/property/${params.key}`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function get1(client: HttpClient, params: { spaceKey: string; expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/property`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function getAllSpacePermissions(client: HttpClient, params: { spaceKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/permissions`,
  });
}

export function getPermissionsGrantedToAnonymousUsers1(client: HttpClient, params: { spaceKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/permissions/anonymous`,
  });
}

export function getPermissionsGrantedToGroup1(client: HttpClient, params: { spaceKey: string; groupName: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/permissions/group/${params.groupName}`,
  });
}

export function getPermissionsGrantedToUser1(client: HttpClient, params: { spaceKey: string; userKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/permissions/user/${params.userKey}`,
  });
}

export function grantPermissionsToAnonymousUsers1(client: HttpClient, params: { spaceKey: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/permissions/anonymous/grant`,
    body: params.requestBody,
  });
}

export function grantPermissionsToGroup1(client: HttpClient, params: { spaceKey: string; groupName: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/permissions/group/${params.groupName}/grant`,
    body: params.requestBody,
  });
}

export function grantPermissionsToUser1(client: HttpClient, params: { spaceKey: string; userKey: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/permissions/user/${params.userKey}/grant`,
    body: params.requestBody,
  });
}

export function index3(client: HttpClient, params: { spaceKey: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/labels`,
    searchParams: { limit: params.limit, start: params.start },
  });
}

export function index4(client: HttpClient, params: { spaceKey: string; limit?: number; start?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/watchers`,
    searchParams: { limit: params.limit, start: params.start },
  });
}

export function popular1(client: HttpClient, params: { spaceKey: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/labels/popular`,
    searchParams: { limit: params.limit, start: params.start },
  });
}

export function recent1(client: HttpClient, params: { spaceKey: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/labels/recent`,
    searchParams: { limit: params.limit, start: params.start },
  });
}

export function related1(client: HttpClient, params: { spaceKey: string; labelName: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}/labels/${params.labelName}/related`,
    searchParams: { limit: params.limit, start: params.start },
  });
}

export function restore(client: HttpClient, params: { spaceKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/restore`,
  });
}

export function revokePermissionsFromAnonymousUser(client: HttpClient, params: { spaceKey: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/permissions/anonymous/revoke`,
    body: params.requestBody,
  });
}

export function revokePermissionsFromGroup1(client: HttpClient, params: { spaceKey: string; groupName: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/permissions/group/${params.groupName}/revoke`,
    body: params.requestBody,
  });
}

export function revokePermissionsFromUser1(client: HttpClient, params: { spaceKey: string; userKey: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/permissions/user/${params.userKey}/revoke`,
    body: params.requestBody,
  });
}

export function setPermissions1(client: HttpClient, params: { spaceKey: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/space/${params.spaceKey}/permissions`,
    body: params.requestBody,
  });
}

export function space(client: HttpClient, params: { spaceKey: string; expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space/${params.spaceKey}`,
    searchParams: { expand: params.expand },
  });
}

export function spaces(client: HttpClient, params: { spaceKeySingle?: string; start?: string; label?: string; favourite?: string; type?: string; spaceKey?: string; spaceId?: Array<string>; expand?: string; hasRetentionPolicy?: string; limit?: string; spaceKeys?: string; contentLabel?: string; spaceIds?: string; status?: string; requestBody?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/space`,
    searchParams: { spaceKeySingle: params.spaceKeySingle, start: params.start, label: params.label, favourite: params.favourite, type: params.type, spaceKey: params.spaceKey, spaceId: params.spaceId, expand: params.expand, hasRetentionPolicy: params.hasRetentionPolicy, limit: params.limit, spaceKeys: params.spaceKeys, contentLabel: params.contentLabel, spaceIds: params.spaceIds, status: params.status },
    body: params.requestBody,
  });
}

export function update3(client: HttpClient, params: { spaceKey: string; key: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}/property/${params.key}`,
    body: params.requestBody,
  });
}

export function update4(client: HttpClient, params: { spaceKey: string; requestBody: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/space/${params.spaceKey}`,
    body: params.requestBody,
  });
}
