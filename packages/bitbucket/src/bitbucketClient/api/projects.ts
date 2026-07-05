import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { PermittedGroupSchema, PermittedUserSchema, ProjectSchema, RepositorySchema } from '../models/index.js';
import type { Branch, PermittedGroup, PermittedUser, Project, Repository } from '../models/index.js';

/** POST /api/latest/projects */
export interface CreateProject {
  requestBody?: Project;
}
export function createProject(client: HttpClient, params: CreateProject): Promise<Project> {
  return client.sendRequest({
    method: 'POST',
    url: '/api/latest/projects',
    body: params.requestBody,
    mediaType: 'application/json',
    schema: ProjectSchema,
  });
}

/** POST /api/latest/projects/{projectKey}/repos */
export interface CreateRepository {
  projectKey: string;
  requestBody?: Repository;
}
export function createRepository(client: HttpClient, params: CreateRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RepositorySchema,
  });
}

/** DELETE /api/latest/projects/{projectKey} */
export interface DeleteProject {
  projectKey: string;
}
export function deleteProject(client: HttpClient, params: DeleteProject): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}`,
  });
}

/** DELETE /api/latest/projects/{projectKey}/repos/{repositorySlug} */
export interface DeleteRepository {
  projectKey: string;
  repositorySlug: string;
}
export function deleteRepository(client: HttpClient, params: DeleteRepository): Promise<unknown> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
  });
}

/** POST /api/latest/projects/{projectKey}/repos/{repositorySlug} */
export interface ForkRepository {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Repository;
}
export function forkRepository(client: HttpClient, params: ForkRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RepositorySchema,
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug}/forks */
export interface GetForkedRepositories {
  projectKey: string;
  repositorySlug: string;
  start?: number;
  limit?: number;
}
export function getForkedRepositories(client: HttpClient, params: GetForkedRepositories): Promise<RestPage<Repository>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/forks`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RepositorySchema),
  });
}

/** GET /api/latest/projects/{projectKey}/permissions/groups */
export interface GetGroupsWithAnyPermission {
  projectKey: string;
  filter?: string;
  start?: number;
  limit?: number;
}
export function getGroupsWithAnyPermission(client: HttpClient, params: GetGroupsWithAnyPermission): Promise<RestPage<PermittedGroup>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/groups`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedGroupSchema),
  });
}

/** GET /api/latest/projects/{projectKey} */
export interface GetProject {
  projectKey: string;
}
export function getProject(client: HttpClient, params: GetProject): Promise<Project> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}`,
    schema: ProjectSchema,
  });
}

/** GET /api/latest/projects */
export interface GetProjects {
  name?: string;
  permission?: string;
  start?: number;
  limit?: number;
}
export function getProjects(client: HttpClient, params: GetProjects): Promise<RestPage<Project>> {
  return client.sendRequest({
    method: 'GET',
    url: '/api/latest/projects',
    searchParams: { name: params.name, permission: params.permission, start: params.start, limit: params.limit },
    schema: restPage(ProjectSchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos */
export interface GetRepositories {
  projectKey: string;
  start?: number;
  limit?: number;
}
export function getRepositories(client: HttpClient, params: GetRepositories): Promise<RestPage<Repository>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RepositorySchema),
  });
}

/** GET /api/latest/projects/{projectKey}/repos/{repositorySlug} */
export interface GetRepository {
  projectKey: string;
  repositorySlug: string;
}
export function getRepository(client: HttpClient, params: GetRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    schema: RepositorySchema,
  });
}

/** GET /api/latest/projects/{projectKey}/permissions/users */
export interface GetUsersWithAnyPermission {
  projectKey: string;
  filter?: string;
  start?: number;
  limit?: number;
}
export function getUsersWithAnyPermission(client: HttpClient, params: GetUsersWithAnyPermission): Promise<RestPage<PermittedUser>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/users`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedUserSchema),
  });
}

/** DELETE /api/latest/projects/{projectKey}/permissions */
export interface RevokePermissions {
  projectKey: string;
  user?: string;
  group?: string;
}
export function revokePermissions(client: HttpClient, params: RevokePermissions): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions`,
    searchParams: { user: params.user, group: params.group },
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug}/default-branch */
export interface SetDefaultBranch {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Branch;
}
export function setDefaultBranch(client: HttpClient, params: SetDefaultBranch): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/default-branch`,
    body: params.requestBody,
    mediaType: 'application/json',
  });
}

/** PUT /api/latest/projects/{projectKey}/permissions/groups */
export interface SetPermissionForGroups {
  projectKey: string;
  name?: string;
  permission?: string;
}
export function setPermissionForGroups(client: HttpClient, params: SetPermissionForGroups): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/groups`,
    searchParams: { name: params.name, permission: params.permission },
  });
}

/** PUT /api/latest/projects/{projectKey}/permissions/users */
export interface SetPermissionForUsers {
  projectKey: string;
  name?: string;
  permission?: string;
}
export function setPermissionForUsers(client: HttpClient, params: SetPermissionForUsers): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/users`,
    searchParams: { name: params.name, permission: params.permission },
  });
}

/** PUT /api/latest/projects/{projectKey} */
export interface UpdateProject {
  projectKey: string;
  requestBody?: Project;
}
export function updateProject(client: HttpClient, params: UpdateProject): Promise<Project> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: ProjectSchema,
  });
}

/** PUT /api/latest/projects/{projectKey}/repos/{repositorySlug} */
export interface UpdateRepository {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Repository;
}
export function updateRepository(client: HttpClient, params: UpdateRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RepositorySchema,
  });
}
