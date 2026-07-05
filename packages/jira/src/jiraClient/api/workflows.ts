import { route, type HttpClient } from 'datacenter-mcp-core';
import { type AddFieldBean, type CustomFieldDefinitionJsonBean, FieldBeanSchema, type FieldBean, IssueTypeJsonBeanSchema, type IssueTypeJsonBean, IssueTypeMappingBeanSchema, type IssueTypeMappingBean, type MoveFieldBean, PriorityJsonBeanSchema, type PriorityJsonBean, ResolutionJsonBeanSchema, type ResolutionJsonBean, ScreenableFieldBeanSchema, type ScreenableFieldBean, ScreenableTabBeanSchema, type ScreenableTabBean, StatusJsonBeanSchema, type StatusJsonBean, type WorkflowMappingBean, WorkflowSchemeBeanSchema, type WorkflowSchemeBean } from '../models/index.js';

export function addField(client: HttpClient, params: { tabId: number; screenId: number; requestBody?: AddFieldBean }): Promise<ScreenableFieldBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}/fields`,
    body: params.requestBody,
    schema: ScreenableFieldBeanSchema,
  });
}

export function addFieldToDefaultScreen(client: HttpClient, params: { fieldId: string }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/screens/addToDefault/${params.fieldId}`,
  });
}

export function addTab(client: HttpClient, params: { screenId: number; requestBody?: ScreenableTabBean }): Promise<ScreenableTabBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/screens/${params.screenId}/tabs`,
    body: params.requestBody,
    schema: ScreenableTabBeanSchema,
  });
}

export function createCustomField(client: HttpClient, params: { requestBody?: CustomFieldDefinitionJsonBean }): Promise<FieldBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/field`,
    body: params.requestBody,
    schema: FieldBeanSchema,
  });
}

export function createScheme(client: HttpClient, params: { requestBody: WorkflowSchemeBean }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/workflowscheme`,
    body: params.requestBody,
  });
}

export function deleteIssueType(client: HttpClient, params: { issueType: string; id: number; updateDraftIfNeeded?: boolean }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/workflowscheme/${params.id}/issuetype/${params.issueType}`,
    searchParams: { updateDraftIfNeeded: params.updateDraftIfNeeded },
    schema: WorkflowSchemeBeanSchema,
  });
}

export function deleteScheme(client: HttpClient, params: { id: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/workflowscheme/${params.id}`,
  });
}

export function deleteTab(client: HttpClient, params: { tabId: number; screenId: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}`,
  });
}

export function deleteWorkflowMapping(client: HttpClient, params: { id: number; updateDraftIfNeeded?: boolean; workflowName?: string }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/workflowscheme/${params.id}/workflow`,
    searchParams: { updateDraftIfNeeded: params.updateDraftIfNeeded, workflowName: params.workflowName },
    schema: WorkflowSchemeBeanSchema,
  });
}

export function getAllFields(client: HttpClient, params: { tabId: number; screenId: number; projectKey?: string }): Promise<ScreenableFieldBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}/fields`,
    searchParams: { projectKey: params.projectKey },
    schema: ScreenableFieldBeanSchema,
  });
}

export function getAllScreens(client: HttpClient, params: { search?: string; expand?: string; maxResults?: string; startAt?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/screens`,
    searchParams: { search: params.search, expand: params.expand, maxResults: params.maxResults, startAt: params.startAt },
  });
}

export function getAllTabs(client: HttpClient, params: { screenId: number; projectKey?: string }): Promise<ScreenableTabBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/screens/${params.screenId}/tabs`,
    searchParams: { projectKey: params.projectKey },
    schema: ScreenableTabBeanSchema,
  });
}

export function getAllWorkflows(client: HttpClient, params: { workflowName?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/workflow`,
    searchParams: { workflowName: params.workflowName },
  });
}

export function getById(client: HttpClient, params: { id: number; returnDraftIfExists?: boolean }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/workflowscheme/${params.id}`,
    searchParams: { returnDraftIfExists: params.returnDraftIfExists },
    schema: WorkflowSchemeBeanSchema,
  });
}

export function getDefault(client: HttpClient, params: { id: number; returnDraftIfExists?: boolean }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/workflowscheme/${params.id}/default`,
    searchParams: { returnDraftIfExists: params.returnDraftIfExists },
    schema: WorkflowSchemeBeanSchema,
  });
}

export function getFieldsToAdd(client: HttpClient, params: { screenId: number }): Promise<ScreenableFieldBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/screens/${params.screenId}/availableFields`,
    schema: ScreenableFieldBeanSchema,
  });
}

export function getIssueAllTypes(client: HttpClient, _params: Record<string, never>): Promise<IssueTypeJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issuetype`,
    schema: IssueTypeJsonBeanSchema,
  });
}

export function getIssueType(client: HttpClient, params: { issueType: string; id: number; returnDraftIfExists?: boolean }): Promise<IssueTypeMappingBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/workflowscheme/${params.id}/issuetype/${params.issueType}`,
    searchParams: { returnDraftIfExists: params.returnDraftIfExists },
    schema: IssueTypeMappingBeanSchema,
  });
}

export function getPriorities(client: HttpClient, _params: Record<string, never>): Promise<PriorityJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/priority`,
    schema: PriorityJsonBeanSchema,
  });
}

export function getResolutions(client: HttpClient, _params: Record<string, never>): Promise<ResolutionJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/resolution`,
    schema: ResolutionJsonBeanSchema,
  });
}

export function getStatuses(client: HttpClient, _params: Record<string, never>): Promise<StatusJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/status`,
    schema: StatusJsonBeanSchema,
  });
}

export function getWorkflow(client: HttpClient, params: { id: number; workflowName?: string; returnDraftIfExists?: boolean }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/workflowscheme/${params.id}/workflow`,
    searchParams: { workflowName: params.workflowName, returnDraftIfExists: params.returnDraftIfExists },
    schema: WorkflowSchemeBeanSchema,
  });
}

export function moveField(client: HttpClient, params: { tabId: number; screenId: number; id: string; requestBody?: MoveFieldBean }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}/fields/${params.id}/move`,
    body: params.requestBody,
  });
}

export function moveTab(client: HttpClient, params: { tabId: number; screenId: number; pos: number }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}/move/${params.pos}`,
  });
}

export function removeField(client: HttpClient, params: { tabId: number; screenId: number; id: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}/fields/${params.id}`,
  });
}

export function renameTab(client: HttpClient, params: { tabId: number; screenId: number; requestBody?: ScreenableTabBean }): Promise<ScreenableTabBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}`,
    body: params.requestBody,
    schema: ScreenableTabBeanSchema,
  });
}

export function setIssueType(client: HttpClient, params: { issueType: string; id: number; requestBody: IssueTypeMappingBean }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/workflowscheme/${params.id}/issuetype/${params.issueType}`,
    body: params.requestBody,
    schema: WorkflowSchemeBeanSchema,
  });
}

export function update(client: HttpClient, params: { id: number; requestBody: WorkflowSchemeBean }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/workflowscheme/${params.id}`,
    body: params.requestBody,
    schema: WorkflowSchemeBeanSchema,
  });
}

export function updateShowWhenEmptyIndicator(client: HttpClient, params: { tabId: number; screenId: number; newValue: boolean; id: string }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/screens/${params.screenId}/tabs/${params.tabId}/fields/${params.id}/updateShowWhenEmptyIndicator/${params.newValue}`,
  });
}

export function updateWorkflowMapping(client: HttpClient, params: { id: number; requestBody: WorkflowMappingBean; workflowName?: string }): Promise<WorkflowSchemeBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/workflowscheme/${params.id}/workflow`,
    searchParams: { workflowName: params.workflowName },
    body: params.requestBody,
    schema: WorkflowSchemeBeanSchema,
  });
}
