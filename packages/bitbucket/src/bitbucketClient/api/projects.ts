import type { HttpClient } from '../core/types.js';
import { enc, pickBody } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { PermittedGroupSchema, PermittedUserSchema, ProjectSchema, RepositorySchema, BranchSchema } from '../models/index.js';
import type { PermittedGroup, PermittedUser, Project, Repository } from '../models/index.js';
import type { CreateProject, CreateRepository, DeleteProject, DeleteRepository, ForkRepository, GetForkedRepositories, GetProjectGroupsWithAnyPermission, GetProject, GetProjects, GetRepositories, GetRepository, GetProjectUsersWithAnyPermission, RevokeProjectPermissions, SetDefaultBranch, SetPermissionForGroups, SetPermissionForUsers, UpdateProject, UpdateRepository } from '../parameters/index.js';

export function createProject(client: HttpClient, params: CreateProject): Promise<Project> {
  return client.sendRequest({
    method: 'POST',
    url: '/api/latest/projects',
    body: pickBody(params, ProjectSchema),
    mediaType: 'application/json',
    schema: ProjectSchema,
  });
}

export function createRepository(client: HttpClient, params: CreateRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos`,
    body: pickBody(params, RepositorySchema),
    mediaType: 'application/json',
    schema: RepositorySchema,
  });
}

export function deleteProject(client: HttpClient, params: DeleteProject): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}`,
  });
}

export function deleteRepository(client: HttpClient, params: DeleteRepository): Promise<unknown> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
  });
}

export function forkRepository(client: HttpClient, params: ForkRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'POST',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    body: pickBody(params, RepositorySchema),
    mediaType: 'application/json',
    schema: RepositorySchema,
  });
}

export function getForkedRepositories(client: HttpClient, params: GetForkedRepositories): Promise<RestPage<Repository>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/forks`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RepositorySchema),
  });
}

export function getGroupsWithAnyPermission(client: HttpClient, params: GetProjectGroupsWithAnyPermission): Promise<RestPage<PermittedGroup>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/groups`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedGroupSchema),
  });
}

export function getProject(client: HttpClient, params: GetProject): Promise<Project> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}`,
    schema: ProjectSchema,
  });
}

export function getProjects(client: HttpClient, params: GetProjects): Promise<RestPage<Project>> {
  return client.sendRequest({
    method: 'GET',
    url: '/api/latest/projects',
    searchParams: { name: params.name, permission: params.permission, start: params.start, limit: params.limit },
    schema: restPage(ProjectSchema),
  });
}

export function getRepositories(client: HttpClient, params: GetRepositories): Promise<RestPage<Repository>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RepositorySchema),
  });
}

export function getRepository(client: HttpClient, params: GetRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    schema: RepositorySchema,
  });
}

export function getUsersWithAnyPermission(client: HttpClient, params: GetProjectUsersWithAnyPermission): Promise<RestPage<PermittedUser>> {
  return client.sendRequest({
    method: 'GET',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/users`,
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedUserSchema),
  });
}

export function revokePermissions(client: HttpClient, params: RevokeProjectPermissions): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions`,
    searchParams: { user: params.user, group: params.group },
  });
}

export function setDefaultBranch(client: HttpClient, params: SetDefaultBranch): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/default-branch`,
    body: pickBody(params, BranchSchema),
    mediaType: 'application/json',
  });
}

export function setPermissionForGroups(client: HttpClient, params: SetPermissionForGroups): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/groups`,
    searchParams: { name: params.name, permission: params.permission },
  });
}

export function setPermissionForUsers(client: HttpClient, params: SetPermissionForUsers): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/permissions/users`,
    searchParams: { name: params.name, permission: params.permission },
  });
}

export function updateProject(client: HttpClient, params: UpdateProject): Promise<Project> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}`,
    body: pickBody(params, ProjectSchema),
    mediaType: 'application/json',
    schema: ProjectSchema,
  });
}

export function updateRepository(client: HttpClient, params: UpdateRepository): Promise<Repository> {
  return client.sendRequest({
    method: 'PUT',
    url: `/api/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    body: pickBody(params, RepositorySchema),
    mediaType: 'application/json',
    schema: RepositorySchema,
  });
}
