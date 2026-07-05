import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { PermittedGroupSchema, PermittedUserSchema } from '../models/index.js';
import type { PermittedGroup, PermittedUser } from '../models/index.js';
import type { GetRepositoryGroupsWithAnyPermission, GetRepositoryUsersWithAnyPermission, RevokeRepositoryPermissions, SetPermissionForGroup, SetPermissionForUser } from '../parameters/index.js';

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups */
export function getGroupsWithAnyPermission(client: HttpClient, params: GetRepositoryGroupsWithAnyPermission): Promise<RestPage<PermittedGroup>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/groups`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedGroupSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users */
export function getUsersWithAnyPermission(client: HttpClient, params: GetRepositoryUsersWithAnyPermission): Promise<RestPage<PermittedUser>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/users`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedUserSchema),
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions */
export function revokePermissions(client: HttpClient, params: RevokeRepositoryPermissions): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions`,
    searchParams: { user: params.user, group: params.group },
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups */
export function setPermissionForGroup(client: HttpClient, params: SetPermissionForGroup): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/groups`,
    searchParams: { name: params.name, permission: params.permission },
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users */
export function setPermissionForUser(client: HttpClient, params: SetPermissionForUser): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/users`,
    searchParams: { name: params.name, permission: params.permission },
  });
}
