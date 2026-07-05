import { route, type HttpClient } from 'datacenter-mcp-core';
import { type AddGroupBean, GroupBeanSchema, type GroupBean, GroupSuggestionsBeanSchema, type GroupSuggestionsBean, type PasswordBean, PermissionsJsonBeanSchema, type PermissionsJsonBean, type UpdateUserToGroupBean, type UserAnonymizationRequestBean, UserBeanSchema, type UserBean, UserJsonBeanSchema, type UserJsonBean, UserWriteBeanSchema, type UserWriteBean, UsersAndGroupsBeanSchema, type UsersAndGroupsBean } from '../models/index.js';

export function addUserToGroup(client: HttpClient, params: { groupname: string; requestBody?: UpdateUserToGroupBean }): Promise<GroupBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/group/user`,
    searchParams: { groupname: params.groupname },
    body: params.requestBody,
    schema: GroupBeanSchema,
  });
}

export function changeUserPassword(client: HttpClient, params: { requestBody: PasswordBean; key?: string; username?: string }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/user/password`,
    searchParams: { key: params.key, username: params.username },
    body: params.requestBody,
  });
}

export function createGroup(client: HttpClient, params: { requestBody?: AddGroupBean }): Promise<GroupBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/group`,
    body: params.requestBody,
    schema: GroupBeanSchema,
  });
}

export function createUser(client: HttpClient, params: { requestBody: UserWriteBean }): Promise<UserWriteBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/user`,
    body: params.requestBody,
    schema: UserWriteBeanSchema,
  });
}

export function findAssignableUsers(client: HttpClient, params: { issueKey?: string; maxResults?: number; project?: string; actionDescriptorId?: number; username?: string }): Promise<UserBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/user/assignable/search`,
    searchParams: { issueKey: params.issueKey, maxResults: params.maxResults, project: params.project, actionDescriptorId: params.actionDescriptorId, username: params.username },
    schema: UserBeanSchema.array(),
  });
}

export function findGroups(client: HttpClient, params: { maxResults?: string; query?: string; exclude?: string; userName?: string }): Promise<GroupSuggestionsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/groups/picker`,
    searchParams: { maxResults: params.maxResults, query: params.query, exclude: params.exclude, userName: params.userName },
    schema: GroupSuggestionsBeanSchema,
  });
}

export function findUsers(client: HttpClient, params: { includeInactive?: boolean; maxResults?: number; includeActive?: boolean; startAt?: number; username?: string }): Promise<UserBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/user/search`,
    searchParams: { includeInactive: params.includeInactive, maxResults: params.maxResults, includeActive: params.includeActive, startAt: params.startAt, username: params.username },
    schema: UserBeanSchema.array(),
  });
}

export function findUsersAndGroups(client: HttpClient, params: { issueTypeId?: string; maxResults?: string; query?: string; showAvatar?: string; projectId?: string; fieldId?: string }): Promise<UsersAndGroupsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/groupuserpicker`,
    searchParams: { issueTypeId: params.issueTypeId, maxResults: params.maxResults, query: params.query, showAvatar: params.showAvatar, projectId: params.projectId, fieldId: params.fieldId },
    schema: UsersAndGroupsBeanSchema,
  });
}

export function getAllPermissions(client: HttpClient, _params: Record<string, never>): Promise<PermissionsJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/permissions`,
    schema: PermissionsJsonBeanSchema,
  });
}

export function getMyselfUser(client: HttpClient, _params: Record<string, never>): Promise<UserBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/myself`,
    schema: UserBeanSchema,
  });
}

export function getPermissions(client: HttpClient, params: { issueId?: string; projectKey?: string; issueKey?: string; projectId?: string }): Promise<PermissionsJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/mypermissions`,
    searchParams: { issueId: params.issueId, projectKey: params.projectKey, issueKey: params.issueKey, projectId: params.projectId },
    schema: PermissionsJsonBeanSchema,
  });
}

export function getPreference(client: HttpClient, params: { key?: string }): Promise<string> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/mypreferences`,
    searchParams: { key: params.key },
  });
}

export function getProgress(client: HttpClient, params: { taskId?: number }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/user/anonymization/progress`,
    searchParams: { taskId: params.taskId },
  });
}

export function getUsersFromGroup(client: HttpClient, params: { groupname: string; includeInactiveUsers?: string; maxResults?: string; startAt?: string }): Promise<UserJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/group/member`,
    searchParams: { includeInactiveUsers: params.includeInactiveUsers, maxResults: params.maxResults, groupname: params.groupname, startAt: params.startAt },
    schema: UserJsonBeanSchema,
  });
}

export function getUserUser(client: HttpClient, params: { includeDeleted?: boolean; key?: string; username?: string }): Promise<UserBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/user`,
    searchParams: { includeDeleted: params.includeDeleted, key: params.key, username: params.username },
    schema: UserBeanSchema,
  });
}

export function removeGroup(client: HttpClient, params: { groupname: string; swapGroup?: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/group`,
    searchParams: { groupname: params.groupname, swapGroup: params.swapGroup },
  });
}

export function removePreference(client: HttpClient, params: { key?: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/mypreferences`,
    searchParams: { key: params.key },
  });
}

export function removeUser(client: HttpClient, params: { key?: string; username?: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/user`,
    searchParams: { key: params.key, username: params.username },
  });
}

export function removeUserFromGroup(client: HttpClient, params: { groupname: string; username: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/group/user`,
    searchParams: { groupname: params.groupname, username: params.username },
  });
}

export function scheduleUserAnonymization(client: HttpClient, params: { requestBody: UserAnonymizationRequestBean }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/user/anonymization`,
    body: params.requestBody,
  });
}

export function setPreference(client: HttpClient, params: { key?: string; requestBody?: string }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/mypreferences`,
    searchParams: { key: params.key },
    body: params.requestBody,
    contentType: 'application/json',
  });
}

export function validateUserAnonymization(client: HttpClient, params: { expand?: string; userKey?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/user/anonymization`,
    searchParams: { expand: params.expand, userKey: params.userKey },
  });
}
