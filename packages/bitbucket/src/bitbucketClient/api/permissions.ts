import type { HttpClient } from 'datacenter-mcp-core';
import { route } from 'datacenter-mcp-core';
import { restPage } from '../core/page.js';
import type { RestPage } from '../interface/index.js';
import { PermittedGroupSchema, PermittedUserSchema } from '../models/index.js';
import type { PermittedGroup, PermittedUser } from '../models/index.js';
import type { GetRepositoryGroupsWithAnyPermission, GetRepositoryUsersWithAnyPermission, RevokeRepositoryPermissions, SetPermissionForGroup, SetPermissionForUser } from '../parameters/index.js';

export function getGroupsWithAnyPermission(client: HttpClient, params: GetRepositoryGroupsWithAnyPermission): Promise<RestPage<PermittedGroup>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/permissions/groups`,
    method: 'GET',
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedGroupSchema),
  });
}

export function getUsersWithAnyPermission(client: HttpClient, params: GetRepositoryUsersWithAnyPermission): Promise<RestPage<PermittedUser>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/permissions/users`,
    method: 'GET',
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedUserSchema),
  });
}

export function revokePermissions(client: HttpClient, params: RevokeRepositoryPermissions): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/permissions`,
    method: 'DELETE',
    searchParams: { user: params.user, group: params.group },
  });
}

export function setPermissionForGroup(client: HttpClient, params: SetPermissionForGroup): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/permissions/groups`,
    method: 'PUT',
    searchParams: { name: params.name, permission: params.permission },
  });
}

export function setPermissionForUser(client: HttpClient, params: SetPermissionForUser): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/permissions/users`,
    method: 'PUT',
    searchParams: { name: params.name, permission: params.permission },
  });
}
