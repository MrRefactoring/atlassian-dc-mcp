import type { HttpClient } from '../interface/index.js';
import { route, pickBody } from '../core/helpers.js';
import { restPage } from '../core/page.js';
import type { RestPage } from '../interface/index.js';
import { PermittedGroupSchema, PermittedUserSchema, ProjectSchema, RepositorySchema, BranchSchema } from '../models/index.js';
import type { PermittedGroup, PermittedUser, Project, Repository } from '../models/index.js';
import type { CreateProject, CreateRepository, DeleteProject, DeleteRepository, ForkRepository, GetForkedRepositories, GetProjectGroupsWithAnyPermission, GetProject, GetProjects, GetRepositories, GetRepository, GetProjectUsersWithAnyPermission, RevokeProjectPermissions, SetDefaultBranch, SetPermissionForGroups, SetPermissionForUsers, UpdateProject, UpdateRepository } from '../parameters/index.js';

export function createProject(client: HttpClient, params: CreateProject): Promise<Project> {
  return client.sendRequest({
    url: '/api/latest/projects',
    method: 'POST',
    body: pickBody(params, ProjectSchema),
    contentType: 'application/json',
    schema: ProjectSchema,
  });
}

export function createRepository(client: HttpClient, params: CreateRepository): Promise<Repository> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos`,
    method: 'POST',
    body: pickBody(params, RepositorySchema),
    contentType: 'application/json',
    schema: RepositorySchema,
  });
}

export function deleteProject(client: HttpClient, params: DeleteProject): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}`,
    method: 'DELETE',
  });
}

export function deleteRepository(client: HttpClient, params: DeleteRepository): Promise<unknown> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}`,
    method: 'DELETE',
  });
}

export function forkRepository(client: HttpClient, params: ForkRepository): Promise<Repository> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}`,
    method: 'POST',
    body: pickBody(params, RepositorySchema),
    contentType: 'application/json',
    schema: RepositorySchema,
  });
}

export function getForkedRepositories(client: HttpClient, params: GetForkedRepositories): Promise<RestPage<Repository>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/forks`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RepositorySchema),
  });
}

export function getGroupsWithAnyPermission(client: HttpClient, params: GetProjectGroupsWithAnyPermission): Promise<RestPage<PermittedGroup>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/permissions/groups`,
    method: 'GET',
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedGroupSchema),
  });
}

export function getProject(client: HttpClient, params: GetProject): Promise<Project> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}`,
    method: 'GET',
    schema: ProjectSchema,
  });
}

export function getProjects(client: HttpClient, params: GetProjects): Promise<RestPage<Project>> {
  return client.sendRequest({
    url: '/api/latest/projects',
    method: 'GET',
    searchParams: { name: params.name, permission: params.permission, start: params.start, limit: params.limit },
    schema: restPage(ProjectSchema),
  });
}

export function getRepositories(client: HttpClient, params: GetRepositories): Promise<RestPage<Repository>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(RepositorySchema),
  });
}

export function getRepository(client: HttpClient, params: GetRepository): Promise<Repository> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}`,
    method: 'GET',
    schema: RepositorySchema,
  });
}

export function getUsersWithAnyPermission(client: HttpClient, params: GetProjectUsersWithAnyPermission): Promise<RestPage<PermittedUser>> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/permissions/users`,
    method: 'GET',
    searchParams: { filter: params.filter, start: params.start, limit: params.limit },
    schema: restPage(PermittedUserSchema),
  });
}

export function revokePermissions(client: HttpClient, params: RevokeProjectPermissions): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/permissions`,
    method: 'DELETE',
    searchParams: { user: params.user, group: params.group },
  });
}

export function setDefaultBranch(client: HttpClient, params: SetDefaultBranch): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/default-branch`,
    method: 'PUT',
    body: pickBody(params, BranchSchema),
    contentType: 'application/json',
  });
}

export function setPermissionForGroups(client: HttpClient, params: SetPermissionForGroups): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/permissions/groups`,
    method: 'PUT',
    searchParams: { name: params.name, permission: params.permission },
  });
}

export function setPermissionForUsers(client: HttpClient, params: SetPermissionForUsers): Promise<void> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/permissions/users`,
    method: 'PUT',
    searchParams: { name: params.name, permission: params.permission },
  });
}

export function updateProject(client: HttpClient, params: UpdateProject): Promise<Project> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}`,
    method: 'PUT',
    body: pickBody(params, ProjectSchema),
    contentType: 'application/json',
    schema: ProjectSchema,
  });
}

export function updateRepository(client: HttpClient, params: UpdateRepository): Promise<Repository> {
  return client.sendRequest({
    url: route`/api/latest/projects/${params.projectKey}/repos/${params.repositorySlug}`,
    method: 'PUT',
    body: pickBody(params, RepositorySchema),
    contentType: 'application/json',
    schema: RepositorySchema,
  });
}
