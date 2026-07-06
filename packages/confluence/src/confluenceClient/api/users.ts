import { route, type HttpClient } from 'datacenter-mcp-core';

export function changePassword(client: HttpClient, params: { username: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/admin/user/${params.username}/password`,
    body: params.requestBody,
  });
}

export function changePassword1(client: HttpClient, params: { requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/user/current/password`,
    body: params.requestBody,
  });
}

export function create(client: HttpClient, params: { requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/admin/group`,
    body: params.requestBody,
  });
}

export function createUser(client: HttpClient, params: { requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/admin/user`,
    body: params.requestBody,
  });
}

export function deleteGroup(client: HttpClient, params: { groupName: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/admin/group/${params.groupName}`,
  });
}

export function delete1(client: HttpClient, params: { username: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/admin/user/${params.username}`,
  });
}

export function delete6(client: HttpClient, params: { groupName: string; username: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/user/${params.username}/group/${params.groupName}`,
  });
}

export function disable(client: HttpClient, params: { username: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/admin/user/${params.username}/disable`,
  });
}

export function enable(client: HttpClient, params: { username: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/admin/user/${params.username}/enable`,
  });
}

export function getActiveUsers(client: HttpClient, params: { expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/admin/users/list/active`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function getAnonymous(client: HttpClient, params: { expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/user/anonymous`,
    searchParams: { expand: params.expand },
  });
}

export function getCurrent(client: HttpClient, params: { expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/user/current`,
    searchParams: { expand: params.expand },
  });
}

export function getGroup(client: HttpClient, params: { groupName: string; expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/group/${params.groupName}`,
    searchParams: { expand: params.expand },
  });
}

export function getGroups(client: HttpClient, params: { expand?: string; limit?: number; start?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/group`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function getGroups1(client: HttpClient, params: { expand?: string; limit?: string; start?: string; key?: string; username?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/user/memberof`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start, key: params.key, username: params.username },
  });
}

export function getMembers(client: HttpClient, params: { groupName: string; expand?: string; limit?: number; start?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/group/${params.groupName}/member`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function getNestedGroupMembers(client: HttpClient, params: { groupName: string; expand?: string; limit?: number; start?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/group/${params.groupName}/groupmember`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function getUser(client: HttpClient, params: { expand?: string; key?: string; username?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/user`,
    searchParams: { expand: params.expand, key: params.key, username: params.username },
  });
}

export function getUsers(client: HttpClient, params: { expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/user/list`,
    searchParams: { expand: params.expand, limit: params.limit, start: params.start },
  });
}

export function update5(client: HttpClient, params: { groupName: string; username: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/user/${params.username}/group/${params.groupName}`,
  });
}

export function updateUser(client: HttpClient, params: { username: string; requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/admin/user/${params.username}`,
    body: params.requestBody,
  });
}

export function updateUser1(client: HttpClient, params: { requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/user/current`,
    body: params.requestBody,
  });
}
