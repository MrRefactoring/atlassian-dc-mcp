import { route, type HttpClient } from 'datacenter-mcp-core';
import { type ActorsMap, ComponentBeanSchema, type ComponentBean, ComponentIssueCountsBeanSchema, type ComponentIssueCountsBean, type DeleteAndReplaceVersionBean, EntityPropertiesKeysBeanSchema, type EntityPropertiesKeysBean, EntityPropertyBeanSchema, type EntityPropertyBean, ErrorCollectionSchema, type ErrorCollection, PageBeanSchema, type PageBean, ProjectBeanSchema, type ProjectBean, type ProjectCategoryBean, ProjectCategoryJsonBeanSchema, type ProjectCategoryJsonBean, ProjectIdentitySchema, type ProjectIdentity, type ProjectInputBean, ProjectPickerResultWrapperSchema, type ProjectPickerResultWrapper, type ProjectRoleActorsUpdateBean, ProjectRoleBeanSchema, type ProjectRoleBean, type ProjectUpdateBean, type PropertyBean, VersionBeanSchema, type VersionBean, VersionIssueCountsBeanSchema, type VersionIssueCountsBean, type VersionMoveBean, VersionUnresolvedIssueCountsBeanSchema, type VersionUnresolvedIssueCountsBean } from '../models/index.js';

export function addActorUsers(client: HttpClient, params: { projectIdOrKey: string; id: number; requestBody: ActorsMap }): Promise<ProjectRoleBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/project/${params.projectIdOrKey}/role/${params.id}`,
    body: params.requestBody,
    schema: ProjectRoleBeanSchema,
  });
}

export function archiveProject(client: HttpClient, params: { projectIdOrKey: string }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/project/${params.projectIdOrKey}/archive`,
  });
}

export function componentDelete(client: HttpClient, params: { id: string; moveIssuesTo?: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/component/${params.id}`,
    searchParams: { moveIssuesTo: params.moveIssuesTo },
  });
}

export function createComponent(client: HttpClient, params: { requestBody?: ComponentBean }): Promise<ComponentBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/component`,
    body: params.requestBody,
    schema: ComponentBeanSchema,
  });
}

export function createProject(client: HttpClient, params: { requestBody: ProjectInputBean }): Promise<ProjectIdentity> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/project`,
    body: params.requestBody,
    schema: ProjectIdentitySchema,
  });
}

export function createProjectCategory(client: HttpClient, params: { requestBody: ProjectCategoryBean }): Promise<ProjectCategoryJsonBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/projectCategory`,
    body: params.requestBody,
    schema: ProjectCategoryJsonBeanSchema,
  });
}

export function createVersion(client: HttpClient, params: { requestBody: VersionBean }): Promise<VersionBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/version`,
    body: params.requestBody,
    schema: VersionBeanSchema,
  });
}

export function deleteActor(client: HttpClient, params: { projectIdOrKey: string; id: number; user?: string; group?: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/project/${params.projectIdOrKey}/role/${params.id}`,
    searchParams: { user: params.user, group: params.group },
  });
}

export function deleteProject(client: HttpClient, params: { projectIdOrKey: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/project/${params.projectIdOrKey}`,
  });
}

export function deleteProperty(client: HttpClient, params: { propertyKey: string; projectIdOrKey: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/project/${params.projectIdOrKey}/properties/${params.propertyKey}`,
  });
}

export function getAllProjectCategories(client: HttpClient, params: Record<string, never>): Promise<ProjectCategoryJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/projectCategory`,
    schema: ProjectCategoryJsonBeanSchema,
  });
}

export function getAllProjects(client: HttpClient, params: { includeArchived?: boolean; expand?: string; recent?: number; browseArchive?: boolean }): Promise<ProjectBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project`,
    searchParams: { includeArchived: params.includeArchived, expand: params.expand, recent: params.recent, browseArchive: params.browseArchive },
    schema: ProjectBeanSchema,
  });
}

export function getComponent(client: HttpClient, params: { id: string }): Promise<ComponentBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/component/${params.id}`,
    schema: ComponentBeanSchema,
  });
}

export function getComponentRelatedIssues(client: HttpClient, params: { id: string }): Promise<ComponentIssueCountsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/component/${params.id}/relatedIssueCounts`,
    schema: ComponentIssueCountsBeanSchema,
  });
}

export function getPaginatedComponents(client: HttpClient, params: { maxResults?: string; query?: string; projectIds?: string; startAt?: string }): Promise<PageBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/component/page`,
    searchParams: { maxResults: params.maxResults, query: params.query, projectIds: params.projectIds, startAt: params.startAt },
    schema: PageBeanSchema,
  });
}

export function getPaginatedVersions(client: HttpClient, params: { maxResults?: number; query?: string; projectIds?: Array<number>; startAt?: number }): Promise<VersionBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/version`,
    searchParams: { maxResults: params.maxResults, query: params.query, projectIds: params.projectIds, startAt: params.startAt },
    schema: VersionBeanSchema,
  });
}

export function getProjectCategoryById(client: HttpClient, params: { id: number }): Promise<ProjectCategoryJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/projectCategory/${params.id}`,
    schema: ProjectCategoryJsonBeanSchema,
  });
}

export function getProjectComponents(client: HttpClient, params: { projectIdOrKey: string }): Promise<ComponentBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project/${params.projectIdOrKey}/components`,
    schema: ComponentBeanSchema,
  });
}

export function getProjectProject(client: HttpClient, params: { projectIdOrKey: string; expand?: string }): Promise<ProjectBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project/${params.projectIdOrKey}`,
    searchParams: { expand: params.expand },
    schema: ProjectBeanSchema,
  });
}

export function getProjectRole(client: HttpClient, params: { projectIdOrKey: string; id: number }): Promise<ProjectRoleBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project/${params.projectIdOrKey}/role/${params.id}`,
    schema: ProjectRoleBeanSchema,
  });
}

export function getProjectRoles(client: HttpClient, params: { projectIdOrKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project/${params.projectIdOrKey}/role`,
  });
}

export function getProjectvalidateProject(client: HttpClient, params: { key?: string }): Promise<ErrorCollection> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/projectvalidate/key`,
    searchParams: { key: params.key },
    schema: ErrorCollectionSchema,
  });
}

export function getProjectVersions(client: HttpClient, params: { projectIdOrKey: string; expand?: string }): Promise<VersionBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project/${params.projectIdOrKey}/versions`,
    searchParams: { expand: params.expand },
    schema: VersionBeanSchema,
  });
}

export function getPropertiesKeys(client: HttpClient, params: { projectIdOrKey: string }): Promise<EntityPropertiesKeysBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project/${params.projectIdOrKey}/properties`,
    schema: EntityPropertiesKeysBeanSchema,
  });
}

export function getProperty(client: HttpClient, params: { propertyKey: string; projectIdOrKey: string }): Promise<EntityPropertyBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/project/${params.projectIdOrKey}/properties/${params.propertyKey}`,
    schema: EntityPropertyBeanSchema,
  });
}

export function getVersion(client: HttpClient, params: { id: string; expand?: string }): Promise<VersionBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/version/${params.id}`,
    searchParams: { expand: params.expand },
    schema: VersionBeanSchema,
  });
}

export function getVersionRelatedIssues(client: HttpClient, params: { id: string }): Promise<VersionIssueCountsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/version/${params.id}/relatedIssueCounts`,
    schema: VersionIssueCountsBeanSchema,
  });
}

export function getVersionUnresolvedIssues(client: HttpClient, params: { id: string }): Promise<VersionUnresolvedIssueCountsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/version/${params.id}/unresolvedIssueCount`,
    schema: VersionUnresolvedIssueCountsBeanSchema,
  });
}

export function merge(client: HttpClient, params: { moveIssuesTo: string; id: string }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/version/${params.id}/mergeto/${params.moveIssuesTo}`,
  });
}

export function moveVersion(client: HttpClient, params: { id: string; requestBody: VersionMoveBean }): Promise<VersionBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/version/${params.id}/move`,
    body: params.requestBody,
    schema: VersionBeanSchema,
  });
}

export function removeProjectCategory(client: HttpClient, params: { id: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/projectCategory/${params.id}`,
  });
}

export function restoreProject(client: HttpClient, params: { projectIdOrKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/project/${params.projectIdOrKey}/restore`,
  });
}

export function searchForProjects(client: HttpClient, params: { maxResults?: number; query?: string; allowEmptyQuery?: boolean }): Promise<ProjectPickerResultWrapper> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/projects/picker`,
    searchParams: { maxResults: params.maxResults, query: params.query, allowEmptyQuery: params.allowEmptyQuery },
    schema: ProjectPickerResultWrapperSchema,
  });
}

export function setActors(client: HttpClient, params: { projectIdOrKey: string; id: number; requestBody: ProjectRoleActorsUpdateBean }): Promise<ProjectRoleBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/project/${params.projectIdOrKey}/role/${params.id}`,
    body: params.requestBody,
    schema: ProjectRoleBeanSchema,
  });
}

export function setProperty(client: HttpClient, params: { propertyKey: string; projectIdOrKey: string; requestBody: PropertyBean }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/project/${params.projectIdOrKey}/properties/${params.propertyKey}`,
    body: params.requestBody,
  });
}

export function updateComponent(client: HttpClient, params: { id: string; requestBody?: ComponentBean }): Promise<ComponentBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/component/${params.id}`,
    body: params.requestBody,
    schema: ComponentBeanSchema,
  });
}

export function updateProject(client: HttpClient, params: { projectIdOrKey: string; requestBody: ProjectUpdateBean; expand?: string }): Promise<ProjectBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/project/${params.projectIdOrKey}`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: ProjectBeanSchema,
  });
}

export function updateProjectCategory(client: HttpClient, params: { id: number; requestBody: ProjectCategoryBean }): Promise<ProjectCategoryJsonBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/projectCategory/${params.id}`,
    body: params.requestBody,
    schema: ProjectCategoryJsonBeanSchema,
  });
}

export function updateVersion(client: HttpClient, params: { id: string; requestBody: VersionBean }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/version/${params.id}`,
    body: params.requestBody,
  });
}

export function versionDelete(client: HttpClient, params: { id: string; requestBody: DeleteAndReplaceVersionBean }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/version/${params.id}/removeAndSwap`,
    body: params.requestBody,
  });
}
