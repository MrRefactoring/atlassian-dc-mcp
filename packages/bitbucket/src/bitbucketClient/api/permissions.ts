import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { PermittedGroupSchema, PermittedUserSchema } from '../models/index.js';
import type { PermittedGroup, PermittedUser } from '../models/index.js';

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups */
export interface GetGroupsWithAnyPermission {
  projectKey: string;
  repositorySlug: string;
  filter?: string;
  start?: number;
  limit?: number;
}
export function getGroupsWithAnyPermission(client: HttpClient, params: GetGroupsWithAnyPermission): Promise<RestPage<PermittedGroup>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/groups`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedGroupSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users */
export interface GetUsersWithAnyPermission {
  projectKey: string;
  repositorySlug: string;
  filter?: string;
  start?: number;
  limit?: number;
}
export function getUsersWithAnyPermission(client: HttpClient, params: GetUsersWithAnyPermission): Promise<RestPage<PermittedUser>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/users`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedUserSchema),
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions */
export interface RevokePermissions {
  projectKey: string;
  repositorySlug: string;
  user?: string;
  group?: string;
}
export function revokePermissions(client: HttpClient, params: RevokePermissions): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions`,
    searchParams: { user: params.user, group: params.group },
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups */
export interface SetPermissionForGroup {
  projectKey: string;
  name: Array<string>;
  permission: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN';
  repositorySlug: string;
}
export function setPermissionForGroup(client: HttpClient, params: SetPermissionForGroup): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/groups`,
    searchParams: { name: params.name, permission: params.permission },
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users */
export interface SetPermissionForUser {
  projectKey: string;
  name: Array<string>;
  permission: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN';
  repositorySlug: string;
}
export function setPermissionForUser(client: HttpClient, params: SetPermissionForUser): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/permissions/users`,
    searchParams: { name: params.name, permission: params.permission },
  });
}
