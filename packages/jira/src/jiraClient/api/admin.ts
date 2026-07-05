import { route, type HttpClient } from 'datacenter-mcp-core';
import { type ActorInputBean, ApplicationRoleBeanSchema, type ApplicationRoleBean, type AssociateProjectsBean, type AuthParams, AuthSuccessSchema, type AuthSuccess, AutoCompleteResponseBeanSchema, type AutoCompleteResponseBean, AutoCompleteResultWrapperSchema, type AutoCompleteResultWrapper, AvatarBeanSchema, type AvatarBean, AvatarCroppingBeanSchema, type AvatarCroppingBean, BulkDeleteResponseBeanSchema, type BulkDeleteResponseBean, ClusterStateSchema, type ClusterState, ColumnItemSchema, type ColumnItem, ConfigurationBeanSchema, type ConfigurationBean, type CreateUpdateRoleRequestBean, DefaultShareScopeBeanSchema, type DefaultShareScopeBean, FilterPermissionBeanSchema, type FilterPermissionBean, CurrentUserSchema, type CurrentUser, CustomFieldBeanSchema, type CustomFieldBean, CustomFieldOptionBeanSchema, type CustomFieldOptionBean, CustomFieldOptionsBeanSchema, type CustomFieldOptionsBean, DashboardBeanSchema, type DashboardBean, DashboardsBeanSchema, type DashboardsBean, type FilePart, FilterBeanSchema, type FilterBean, IndexSnapshotBeanSchema, type IndexSnapshotBean, IndexSnapshotPromiseBeanSchema, type IndexSnapshotPromiseBean, IndexSnapshotStatusBeanSchema, type IndexSnapshotStatusBean, IndexSummaryBeanSchema, type IndexSummaryBean, IssueTypeSchemeBeanSchema, type IssueTypeSchemeBean, type IssueTypeSchemeCreateUpdateBean, IssueTypeSchemeListBeanSchema, type IssueTypeSchemeListBean, LicenseValidationResultsSchema, type LicenseValidationResults, NodeBeanSchema, type NodeBean, NotificationSchemeBeanSchema, type NotificationSchemeBean, PageBeanSchema, type PageBean, PermissionGrantBeanSchema, type PermissionGrantBean, PermissionGrantsBeanSchema, type PermissionGrantsBean, PermissionSchemeBeanSchema, type PermissionSchemeBean, PermissionSchemesBeanSchema, type PermissionSchemesBean, PrioritySchemeBeanSchema, type PrioritySchemeBean, PrioritySchemeListBeanSchema, type PrioritySchemeListBean, type PrioritySchemeUpdateBean, ProjectBeanSchema, type ProjectBean, ProjectRoleActorsBeanSchema, type ProjectRoleActorsBean, ProjectRoleBeanSchema, type ProjectRoleBean, PropertySchema, type Property, ReindexBeanSchema, type ReindexBean, ReindexRequestBeanSchema, type ReindexRequestBean, SecurityLevelJsonBeanSchema, type SecurityLevelJsonBean, SecuritySchemeJsonBeanSchema, type SecuritySchemeJsonBean, SecuritySchemesJsonBeanSchema, type SecuritySchemesJsonBean, ServerInfoBeanSchema, type ServerInfoBean, type StringList } from '../models/index.js';
import { z } from 'zod';

export function acknowledgeErrors(client: HttpClient, _params: Record<string, never>): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/cluster/zdu/retryUpgrade`,
  });
}

export function addProjectAssociationsToScheme(client: HttpClient, params: { schemeId: string; requestBody: AssociateProjectsBean }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issuetypescheme/${params.schemeId}/associations`,
    body: params.requestBody,
  });
}

export function addProjectRoleActorsToRole(client: HttpClient, params: { id: number; requestBody?: ActorInputBean }): Promise<ProjectRoleActorsBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/role/${params.id}/actors`,
    body: params.requestBody,
    schema: ProjectRoleActorsBeanSchema,
  });
}

export function applyEmailTemplates(client: HttpClient, _params: Record<string, never>): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/email-templates/apply`,
  });
}

export function approveUpgrade(client: HttpClient, _params: Record<string, never>): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/cluster/zdu/approve`,
  });
}

export function bulkDeleteCustomFields(client: HttpClient, params: { ids: string }): Promise<BulkDeleteResponseBean> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/customFields`,
    searchParams: { ids: params.ids },
    schema: BulkDeleteResponseBeanSchema,
  });
}

export function cancelUpgrade(client: HttpClient, _params: Record<string, never>): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/cluster/zdu/cancel`,
  });
}

export function changeNodeStateToOffline(client: HttpClient, params: { nodeId: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/cluster/node/${params.nodeId}/offline`,
  });
}

export function createAvatarFromTemporary(client: HttpClient, params: { type: string; owningObjectId: string; requestBody?: AvatarCroppingBean }): Promise<AvatarBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/universal_avatar/type/${params.type}/owner/${params.owningObjectId}/avatar`,
    body: params.requestBody,
    schema: AvatarBeanSchema,
  });
}

export function createFilter(client: HttpClient, params: { expand?: StringList; requestBody?: FilterBean }): Promise<FilterBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/filter`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: FilterBeanSchema,
  });
}

export function createIndexSnapshot(client: HttpClient, _params: Record<string, never>): Promise<IndexSnapshotPromiseBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/index-snapshot`,
    schema: IndexSnapshotPromiseBeanSchema,
  });
}

export function createIssueTypeScheme(client: HttpClient, params: { requestBody: IssueTypeSchemeCreateUpdateBean }): Promise<IssueTypeSchemeBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issuetypescheme`,
    body: params.requestBody,
    schema: IssueTypeSchemeBeanSchema,
  });
}

export function createPermissionGrant(client: HttpClient, params: { schemeId: number; expand?: string; requestBody?: PermissionGrantBean }): Promise<PermissionGrantBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/permissionscheme/${params.schemeId}/permission`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: PermissionGrantBeanSchema,
  });
}

export function createPermissionScheme(client: HttpClient, params: { expand?: string; requestBody?: PermissionSchemeBean }): Promise<PermissionSchemeBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/permissionscheme`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: PermissionSchemeBeanSchema,
  });
}

export function createPriorityScheme(client: HttpClient, params: { requestBody: PrioritySchemeUpdateBean }): Promise<PrioritySchemeBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/priorityschemes`,
    body: params.requestBody,
    schema: PrioritySchemeBeanSchema,
  });
}

export function createProjectRole(client: HttpClient, params: { requestBody: CreateUpdateRoleRequestBean }): Promise<ProjectRoleBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/role`,
    body: params.requestBody,
    schema: ProjectRoleBeanSchema,
  });
}

export function currentUser(client: HttpClient, _params: Record<string, never>): Promise<CurrentUser> {
  return client.sendRequest({
    method: 'GET',
    url: route`/auth/1/session`,
    schema: CurrentUserSchema,
  });
}

export function deleteAvatar(client: HttpClient, params: { id: number; type: string; owningObjectId: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/universal_avatar/type/${params.type}/owner/${params.owningObjectId}/avatar/${params.id}`,
  });
}

export function deleteFilter(client: HttpClient, params: { id: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/filter/${params.id}`,
  });
}

export function getFilterSharePermissions(client: HttpClient, params: { id: string }): Promise<FilterPermissionBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/filter/${params.id}/permission`,
    schema: z.array(FilterPermissionBeanSchema),
  });
}

export function getFilterSharePermission(client: HttpClient, params: { id: string; permissionId: string }): Promise<FilterPermissionBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/filter/${params.id}/permission/${params.permissionId}`,
    schema: FilterPermissionBeanSchema,
  });
}

export function addFilterSharePermission(client: HttpClient, params: { id: string; requestBody: { type: string; projectId?: string; groupname?: string; projectRoleId?: string; rights?: number } }): Promise<FilterPermissionBean[]> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/filter/${params.id}/permission`,
    body: params.requestBody,
    schema: z.array(FilterPermissionBeanSchema),
  });
}

export function deleteFilterSharePermission(client: HttpClient, params: { id: string; permissionId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/filter/${params.id}/permission/${params.permissionId}`,
  });
}

export function getDefaultShareScope(client: HttpClient, _params: Record<string, never>): Promise<DefaultShareScopeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/filter/defaultShareScope`,
    schema: DefaultShareScopeBeanSchema,
  });
}

export function setDefaultShareScope(client: HttpClient, params: { requestBody: { scope: string } }): Promise<DefaultShareScopeBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/filter/defaultShareScope`,
    body: params.requestBody,
    schema: DefaultShareScopeBeanSchema,
  });
}

export function deleteIssueTypeScheme(client: HttpClient, params: { schemeId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issuetypescheme/${params.schemeId}`,
  });
}

export function deleteNode(client: HttpClient, params: { nodeId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/cluster/node/${params.nodeId}`,
  });
}

export function deletePermissionScheme(client: HttpClient, params: { schemeId: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/permissionscheme/${params.schemeId}`,
  });
}

export function deletePermissionSchemeEntity(client: HttpClient, params: { permissionId: number; schemeId: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/permissionscheme/${params.schemeId}/permission/${params.permissionId}`,
  });
}

export function deletePriorityScheme(client: HttpClient, params: { schemeId: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/priorityschemes/${params.schemeId}`,
  });
}

export function deleteProjectRole(client: HttpClient, params: { id: number; swap?: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/role/${params.id}`,
    searchParams: { swap: params.swap },
  });
}

export function deleteProjectRoleActorsFromRole(client: HttpClient, params: { id: number; user?: string; group?: string }): Promise<ProjectRoleActorsBean> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/role/${params.id}/actors`,
    searchParams: { user: params.user, group: params.group },
    schema: ProjectRoleActorsBeanSchema,
  });
}

export function editFilter(client: HttpClient, params: { id: string; expand?: StringList; requestBody?: FilterBean }): Promise<FilterBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/filter/${params.id}`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: FilterBeanSchema,
  });
}

export function fullyUpdateProjectRole(client: HttpClient, params: { id: number; requestBody?: CreateUpdateRoleRequestBean }): Promise<ProjectRoleBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/role/${params.id}`,
    body: params.requestBody,
    schema: ProjectRoleBeanSchema,
  });
}

export function get(client: HttpClient, params: { key: string }): Promise<ApplicationRoleBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/applicationrole/${params.key}`,
    schema: ApplicationRoleBeanSchema,
  });
}

export function getAdvancedSettings(client: HttpClient, _params: Record<string, never>): Promise<Property[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/application-properties/advanced-settings`,
    schema: z.array(PropertySchema),
  });
}

export function getConfiguration(client: HttpClient, _params: Record<string, never>): Promise<ConfigurationBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/configuration`,
    schema: ConfigurationBeanSchema,
  });
}

export function getDefaultColumns(client: HttpClient, _params: Record<string, never>): Promise<ColumnItem[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/settings/columns`,
    schema: z.array(ColumnItemSchema),
  });
}

export function setDefaultColumns(client: HttpClient, params: { columns: string[] }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/settings/columns`,
    // The system default issue-navigator columns take repeated `columns` form fields, not JSON.
    body: params.columns.map((column) => `columns=${encodeURIComponent(column)}`).join('&'),
    contentType: 'application/x-www-form-urlencoded',
  });
}

export function getAll(client: HttpClient, _params: Record<string, never>): Promise<ApplicationRoleBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/applicationrole`,
    schema: z.array(ApplicationRoleBeanSchema),
  });
}

export function getAllIssueTypeSchemes(client: HttpClient, _params: Record<string, never>): Promise<IssueTypeSchemeListBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issuetypescheme`,
    schema: IssueTypeSchemeListBeanSchema,
  });
}

export function getAllNodes(client: HttpClient, _params: Record<string, never>): Promise<NodeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/cluster/nodes`,
    schema: NodeBeanSchema,
  });
}

export function getAllSystemAvatars(client: HttpClient, params: { type: string }): Promise<AvatarBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/avatar/${params.type}/system`,
    schema: AvatarBeanSchema,
  });
}

export function getAssociatedProjects(client: HttpClient, params: { schemeId: string; expand?: string }): Promise<ProjectBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issuetypescheme/${params.schemeId}/associations`,
    searchParams: { expand: params.expand },
    schema: z.array(ProjectBeanSchema),
  });
}

export function getAutoComplete(client: HttpClient, _params: Record<string, never>): Promise<AutoCompleteResponseBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/jql/autocompletedata`,
    schema: AutoCompleteResponseBeanSchema,
  });
}

export function getAvatars(client: HttpClient, params: { type: string; owningObjectId: string }): Promise<AvatarBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/universal_avatar/type/${params.type}/owner/${params.owningObjectId}`,
    schema: AvatarBeanSchema,
  });
}

export function getCustomFieldOption(client: HttpClient, params: { id: string }): Promise<CustomFieldOptionBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/customFieldOption/${params.id}`,
    schema: CustomFieldOptionBeanSchema,
  });
}

export function getCustomFieldOptions(client: HttpClient, params: { customFieldId: string; maxResults?: string; issueTypeIds?: string; query?: string; sortByOptionName?: string; useAllContexts?: string; page?: string; projectIds?: string }): Promise<CustomFieldOptionsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/customFields/${params.customFieldId}/options`,
    searchParams: { maxResults: params.maxResults, issueTypeIds: params.issueTypeIds, query: params.query, sortByOptionName: params.sortByOptionName, useAllContexts: params.useAllContexts, page: params.page, projectIds: params.projectIds },
    schema: CustomFieldOptionsBeanSchema,
  });
}

export function getCustomFields(client: HttpClient, params: { sortColumn?: string; types?: string; search?: string; maxResults?: string; sortOrder?: string; screenIds?: string; lastValueUpdate?: string; projectIds?: string; startAt?: string }): Promise<CustomFieldBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/customFields`,
    searchParams: { sortColumn: params.sortColumn, types: params.types, search: params.search, maxResults: params.maxResults, sortOrder: params.sortOrder, screenIds: params.screenIds, lastValueUpdate: params.lastValueUpdate, projectIds: params.projectIds, startAt: params.startAt },
    schema: CustomFieldBeanSchema,
  });
}

export function getDashboard(client: HttpClient, params: { id: string }): Promise<DashboardBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/dashboard/${params.id}`,
    schema: DashboardBeanSchema,
  });
}

export function getEmailTypes(client: HttpClient, _params: Record<string, never>): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/email-templates/types`,
  });
}

export function getFavouriteFilters(client: HttpClient, params: { expand?: StringList }): Promise<FilterBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/filter/favourite`,
    searchParams: { expand: params.expand },
    schema: z.array(FilterBeanSchema),
  });
}

export function getFieldAutoCompleteForQueryString(client: HttpClient, params: { predicateValue?: string; predicateName?: string; fieldName?: string; fieldValue?: string }): Promise<AutoCompleteResultWrapper> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/jql/autocompletedata/suggestions`,
    searchParams: { predicateValue: params.predicateValue, predicateName: params.predicateName, fieldName: params.fieldName, fieldValue: params.fieldValue },
    schema: AutoCompleteResultWrapperSchema,
  });
}

export function getFilter(client: HttpClient, params: { id: string; expand?: StringList }): Promise<FilterBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/filter/${params.id}`,
    searchParams: { expand: params.expand },
    schema: FilterBeanSchema,
  });
}

export function getIndexSummary(client: HttpClient, _params: Record<string, never>): Promise<IndexSummaryBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/index/summary`,
    schema: IndexSummaryBeanSchema,
  });
}

export function getIssuesecuritylevel(client: HttpClient, params: { id: string }): Promise<SecurityLevelJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/securitylevel/${params.id}`,
    schema: SecurityLevelJsonBeanSchema,
  });
}

export function getIssueSecurityScheme(client: HttpClient, params: { id: string }): Promise<SecuritySchemeJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issuesecurityschemes/${params.id}`,
    schema: SecuritySchemeJsonBeanSchema,
  });
}

export function getIssueSecuritySchemes(client: HttpClient, _params: Record<string, never>): Promise<SecuritySchemesJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issuesecurityschemes`,
    schema: SecuritySchemesJsonBeanSchema,
  });
}

export function getIssueTypeScheme(client: HttpClient, params: { schemeId: string }): Promise<IssueTypeSchemeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issuetypescheme/${params.schemeId}`,
    schema: IssueTypeSchemeBeanSchema,
  });
}

export function getNotificationScheme(client: HttpClient, params: { id: number; expand?: string }): Promise<NotificationSchemeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/notificationscheme/${params.id}`,
    searchParams: { expand: params.expand },
    schema: NotificationSchemeBeanSchema,
  });
}

export function getNotificationSchemes(client: HttpClient, params: { expand?: string; maxResults?: number; startAt?: number }): Promise<PageBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/notificationscheme`,
    searchParams: { expand: params.expand, maxResults: params.maxResults, startAt: params.startAt },
    schema: PageBeanSchema,
  });
}

export function getPermissionScheme(client: HttpClient, params: { schemeId: number; expand?: string }): Promise<PermissionSchemeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/permissionscheme/${params.schemeId}`,
    searchParams: { expand: params.expand },
    schema: PermissionSchemeBeanSchema,
  });
}

export function getPermissionSchemeGrants(client: HttpClient, params: { schemeId: number; expand?: string }): Promise<PermissionGrantsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/permissionscheme/${params.schemeId}/permission`,
    searchParams: { expand: params.expand },
    schema: PermissionGrantsBeanSchema,
  });
}

export function getPermissionSchemes(client: HttpClient, params: { expand?: string }): Promise<PermissionSchemesBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/permissionscheme`,
    searchParams: { expand: params.expand },
    schema: PermissionSchemesBeanSchema,
  });
}

export function getPriorityScheme(client: HttpClient, params: { schemeId: number }): Promise<PrioritySchemeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/priorityschemes/${params.schemeId}`,
    schema: PrioritySchemeBeanSchema,
  });
}

export function getPrioritySchemes(client: HttpClient, params: { maxResults?: number; startAt?: number }): Promise<PrioritySchemeListBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/priorityschemes`,
    searchParams: { maxResults: params.maxResults, startAt: params.startAt },
    schema: PrioritySchemeListBeanSchema,
  });
}

export function getProgress(client: HttpClient, params: { requestId: number }): Promise<ReindexRequestBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/reindex/request/${params.requestId}`,
    schema: ReindexRequestBeanSchema,
  });
}

export function getProgressBulk(client: HttpClient, params: { requestId?: Array<number> }): Promise<ReindexRequestBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/reindex/request/bulk`,
    searchParams: { requestId: params.requestId },
    schema: z.array(ReindexRequestBeanSchema),
  });
}

export function getProjectRoleActorsForRole(client: HttpClient, params: { id: number }): Promise<ProjectRoleActorsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/role/${params.id}/actors`,
    schema: ProjectRoleActorsBeanSchema,
  });
}

export function getProjectRoles(client: HttpClient, _params: Record<string, never>): Promise<ProjectRoleBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/role`,
    schema: z.array(ProjectRoleBeanSchema),
  });
}

export function getProjectRolesById(client: HttpClient, params: { id: number }): Promise<ProjectRoleBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/role/${params.id}`,
    schema: ProjectRoleBeanSchema,
  });
}

export function getProperty(client: HttpClient, params: { permissionLevel: string; key: string; keyFilter?: string }): Promise<Property | Property[]> {
  return client.sendRequest({
    // `/application-properties` returns a single property when `key` is given and an
    // array otherwise, so the response schema accepts either shape.
    method: 'GET',
    url: route`/api/2/application-properties`,
    searchParams: { permissionLevel: params.permissionLevel, keyFilter: params.keyFilter, key: params.key },
    schema: z.union([PropertySchema, z.array(PropertySchema)]),
  });
}

export function getReindexInfo(client: HttpClient, params: { taskId?: number }): Promise<ReindexBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/reindex`,
    searchParams: { taskId: params.taskId },
    schema: ReindexBeanSchema,
  });
}

export function getReindexProgress(client: HttpClient, params: { taskId?: number }): Promise<ReindexBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/reindex/progress`,
    searchParams: { taskId: params.taskId },
    schema: ReindexBeanSchema,
  });
}

export function getServerInfo(client: HttpClient, _params: Record<string, never>): Promise<ServerInfoBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/serverInfo`,
    schema: ServerInfoBeanSchema,
  });
}

export function getState(client: HttpClient, _params: Record<string, never>): Promise<ClusterState> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/cluster/zdu/state`,
    schema: ClusterStateSchema,
  });
}

export function isIndexSnapshotRunning(client: HttpClient, _params: Record<string, never>): Promise<IndexSnapshotStatusBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/index-snapshot/isRunning`,
    schema: IndexSnapshotStatusBeanSchema,
  });
}

export function list(client: HttpClient, params: { filter?: string; maxResults?: string; startAt?: string }): Promise<DashboardsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/dashboard`,
    searchParams: { filter: params.filter, maxResults: params.maxResults, startAt: params.startAt },
    schema: DashboardsBeanSchema,
  });
}

export function listIndexSnapshot(client: HttpClient, _params: Record<string, never>): Promise<IndexSnapshotBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/index-snapshot`,
    schema: z.array(IndexSnapshotBeanSchema),
  });
}

export function login(client: HttpClient, params: { requestBody: AuthParams }): Promise<AuthSuccess> {
  return client.sendRequest({
    method: 'POST',
    url: route`/auth/1/session`,
    body: params.requestBody,
    schema: AuthSuccessSchema,
  });
}

export function logout(client: HttpClient, _params: Record<string, never>): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/auth/1/session`,
  });
}

export function partialUpdateProjectRole(client: HttpClient, params: { id: number; requestBody?: CreateUpdateRoleRequestBean }): Promise<ProjectRoleBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/role/${params.id}`,
    body: params.requestBody,
    schema: ProjectRoleBeanSchema,
  });
}

export function processRequests(client: HttpClient, _params: Record<string, never>): Promise<number> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/reindex/request`,
  });
}

export function reindex(client: HttpClient, params: { indexChangeHistory?: boolean; type?: string; indexWorklogs?: boolean; indexComments?: boolean }): Promise<ReindexBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/reindex`,
    searchParams: { indexChangeHistory: params.indexChangeHistory, type: params.type, indexWorklogs: params.indexWorklogs, indexComments: params.indexComments },
    schema: ReindexBeanSchema,
  });
}

export function reindexIssues(client: HttpClient, params: { issueId?: Array<string>; indexChangeHistory?: boolean; indexWorklogs?: boolean; indexComments?: boolean }): Promise<ReindexBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/reindex/issue`,
    searchParams: { issueId: params.issueId, indexChangeHistory: params.indexChangeHistory, indexWorklogs: params.indexWorklogs, indexComments: params.indexComments },
    schema: ReindexBeanSchema,
  });
}

export function release(client: HttpClient, params: { requestBody?: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/auth/1/websudo`,
    body: params.requestBody,
    contentType: 'application/json',
  });
}

export function removeAllProjectAssociations(client: HttpClient, params: { schemeId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issuetypescheme/${params.schemeId}/associations`,
  });
}

export function removeProjectAssociation(client: HttpClient, params: { projIdOrKey: string; schemeId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issuetypescheme/${params.schemeId}/associations/${params.projIdOrKey}`,
  });
}

export function requestCurrentIndexFromNode(client: HttpClient, params: { nodeId: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/cluster/index-snapshot/${params.nodeId}`,
  });
}

export function revertEmailTemplatesToDefault(client: HttpClient, _params: Record<string, never>): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/email-templates/revert`,
  });
}

export function setProjectAssociationsForScheme(client: HttpClient, params: { schemeId: string; requestBody: AssociateProjectsBean }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issuetypescheme/${params.schemeId}/associations`,
    body: params.requestBody,
  });
}

export function setReadyToUpgrade(client: HttpClient, _params: Record<string, never>): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/cluster/zdu/start`,
  });
}

export function storeTemporaryAvatarUsingMultiPart(client: HttpClient, params: { type: string; owningObjectId: string; formData?: FilePart }): Promise<AvatarCroppingBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/universal_avatar/type/${params.type}/owner/${params.owningObjectId}/temp`,
    formData: params.formData as unknown as Record<string, unknown>,
    contentType: 'multipart/form-data',
    schema: AvatarCroppingBeanSchema,
  });
}

export function updateIssueTypeScheme(client: HttpClient, params: { schemeId: string; requestBody: IssueTypeSchemeCreateUpdateBean }): Promise<IssueTypeSchemeBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issuetypescheme/${params.schemeId}`,
    body: params.requestBody,
    schema: IssueTypeSchemeBeanSchema,
  });
}

export function updatePermissionScheme(client: HttpClient, params: { schemeId: number; expand?: string; requestBody?: PermissionSchemeBean }): Promise<PermissionSchemeBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/permissionscheme/${params.schemeId}`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: PermissionSchemeBeanSchema,
  });
}

export function updatePriorityScheme(client: HttpClient, params: { schemeId: number; requestBody: PrioritySchemeUpdateBean }): Promise<PrioritySchemeBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/priorityschemes/${params.schemeId}`,
    body: params.requestBody,
    schema: PrioritySchemeBeanSchema,
  });
}

export function uploadEmailTemplates(client: HttpClient, params: { requestBody?: Record<string, any> }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/email-templates`,
    body: params.requestBody,
    contentType: 'application/zip',
  });
}

export function validate(client: HttpClient, params: { requestBody: string }): Promise<LicenseValidationResults> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/licenseValidator`,
    body: params.requestBody,
    contentType: 'application/json',
    schema: LicenseValidationResultsSchema,
  });
}
