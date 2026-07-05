import { route, type HttpClient } from 'datacenter-mcp-core';
import { AttachmentBeanSchema, type AttachmentBean, AttachmentJsonBeanSchema, type AttachmentJsonBean, AttachmentMetaBeanSchema, type AttachmentMetaBean, CommentJsonBeanSchema, type CommentJsonBean, CommentsWithPaginationJsonBeanSchema, type CommentsWithPaginationJsonBean, CreateMetaIssueTypeBeanSchema, type CreateMetaIssueTypeBean, EditMetaBeanSchema, type EditMetaBean, EntityPropertiesKeysBeanSchema, type EntityPropertiesKeysBean, EntityPropertyBeanSchema, type EntityPropertyBean, FieldMetaBeanSchema, type FieldMetaBean, IssueBeanSchema, type IssueBean, IssueCreateResponseSchema, type IssueCreateResponse, type IssueLinkTypeJsonBean, IssueLinkTypesBeanSchema, type IssueLinkTypesBean, type IssueRankRequestBean, type IssueUpdateBean, IssuesCreateResponseSchema, type IssuesCreateResponse, type IssuesUpdateBean, type LinkIssueRequestJsonBean, type NotificationJsonBean, PartialSuccessBeanSchema, type PartialSuccessBean, PinnedCommentJsonBeanSchema, type PinnedCommentJsonBean, RemoteIssueLinkBeanSchema, type RemoteIssueLinkBean, type RemoteIssueLinkCreateOrUpdateRequest, type SearchRequestBean, SearchResultsBeanSchema, type SearchResultsBean, type StringList, TransitionsMetaBeanSchema, type TransitionsMetaBean, type UserBean, VoteBeanSchema, type VoteBean, WatchersBeanSchema, type WatchersBean, WorklogChangedSinceBeanSchema, type WorklogChangedSinceBean, type WorklogIdsRequestBean, WorklogWithPaginationBeanSchema, type WorklogWithPaginationBean, issueLinksSchema, type issueLinks, worklogSchema, type worklog } from '../models/index.js';
import { z } from 'zod';

export function addAttachment(client: HttpClient, params: { issueIdOrKey: string; formData?: Blob }): Promise<AttachmentJsonBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/attachments`,
    formData: params.formData as unknown as Record<string, unknown>,
    contentType: 'multipart/form-data',
    schema: AttachmentJsonBeanSchema,
  });
}

export function addComment(client: HttpClient, params: { issueIdOrKey: string; expand?: string; requestBody?: CommentJsonBean }): Promise<CommentJsonBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/comment`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: CommentJsonBeanSchema,
  });
}

export function addVote(client: HttpClient, params: { issueIdOrKey: string }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/votes`,
  });
}

export function addWatcher(client: HttpClient, params: { issueIdOrKey: string; userName?: string; requestBody?: string }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/watchers`,
    searchParams: { userName: params.userName },
    body: params.requestBody,
  });
}

export function addWorklog(client: HttpClient, params: { issueIdOrKey: string; newEstimate?: string; adjustEstimate?: string; reduceBy?: string; requestBody?: worklog }): Promise<worklog> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/worklog`,
    searchParams: { newEstimate: params.newEstimate, adjustEstimate: params.adjustEstimate, reduceBy: params.reduceBy },
    body: params.requestBody,
    schema: worklogSchema,
  });
}

export function archiveIssue(client: HttpClient, params: { issueIdOrKey: string; notifyUsers?: string }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/archive`,
    searchParams: { notifyUsers: params.notifyUsers },
  });
}

export function archiveIssues(client: HttpClient, params: { notifyUsers?: string; requestBody?: string }): Promise<Record<string, any>> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/archive`,
    searchParams: { notifyUsers: params.notifyUsers },
    body: params.requestBody,
    contentType: 'text/plain',
  });
}

export function assign(client: HttpClient, params: { issueIdOrKey: string; requestBody?: UserBean }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/assignee`,
    body: params.requestBody,
  });
}

export function createIssue(client: HttpClient, params: { updateHistory?: boolean; requestBody?: IssueUpdateBean }): Promise<IssueCreateResponse> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue`,
    searchParams: { updateHistory: params.updateHistory },
    body: params.requestBody,
    schema: IssueCreateResponseSchema,
  });
}

export function createIssueLinkType(client: HttpClient, params: { requestBody: IssueLinkTypeJsonBean }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issueLinkType`,
    body: params.requestBody,
  });
}

export function createIssues(client: HttpClient, params: { requestBody?: IssuesUpdateBean }): Promise<IssuesCreateResponse> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/bulk`,
    body: params.requestBody,
    schema: IssuesCreateResponseSchema,
  });
}

export function createOrUpdateRemoteIssueLink(client: HttpClient, params: { issueIdOrKey: string; requestBody?: RemoteIssueLinkCreateOrUpdateRequest }): Promise<RemoteIssueLinkBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/remotelink`,
    body: params.requestBody,
    schema: RemoteIssueLinkBeanSchema,
  });
}

export function deleteComment(client: HttpClient, params: { issueIdOrKey: string; id: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}/comment/${params.id}`,
  });
}

export function deleteCommentProperty(client: HttpClient, params: { propertyKey: string; commentId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/comment/${params.commentId}/properties/${params.propertyKey}`,
  });
}

export function deleteIssue(client: HttpClient, params: { issueIdOrKey: string; deleteSubtasks?: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}`,
    searchParams: { deleteSubtasks: params.deleteSubtasks },
  });
}

export function deleteIssueLink(client: HttpClient, params: { linkId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issueLink/${params.linkId}`,
  });
}

export function deleteIssueLinkType(client: HttpClient, params: { issueLinkTypeId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issueLinkType/${params.issueLinkTypeId}`,
  });
}

export function deleteIssueProperty(client: HttpClient, params: { propertyKey: string; issueIdOrKey: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}/properties/${params.propertyKey}`,
  });
}

export function deleteRemoteIssueLinkByGlobalId(client: HttpClient, params: { issueIdOrKey: string; globalId: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}/remotelink`,
    searchParams: { globalId: params.globalId },
  });
}

export function deleteRemoteIssueLinkById(client: HttpClient, params: { linkId: string; issueIdOrKey: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}/remotelink/${params.linkId}`,
  });
}

export function deleteWorklog(client: HttpClient, params: { issueIdOrKey: string; id: string; newEstimate?: string; adjustEstimate?: string; increaseBy?: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}/worklog/${params.id}`,
    searchParams: { newEstimate: params.newEstimate, adjustEstimate: params.adjustEstimate, increaseBy: params.increaseBy },
  });
}

export function doTransition(client: HttpClient, params: { issueIdOrKey: string; requestBody?: IssueUpdateBean }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/transitions`,
    body: params.requestBody,
  });
}

export function editIssue(client: HttpClient, params: { issueIdOrKey: string; notifyUsers?: string; requestBody?: IssueUpdateBean }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}`,
    searchParams: { notifyUsers: params.notifyUsers },
    body: params.requestBody,
  });
}

export function getAttachment(client: HttpClient, params: { id: string }): Promise<AttachmentBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/attachment/${params.id}`,
    schema: AttachmentBeanSchema,
  });
}

export function getAttachmentMeta(client: HttpClient, _params: Record<string, never>): Promise<AttachmentMetaBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/attachment/meta`,
    schema: AttachmentMetaBeanSchema,
  });
}

export function getCommentPropertiesKeys(client: HttpClient, params: { commentId: string }): Promise<EntityPropertiesKeysBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/comment/${params.commentId}/properties`,
    schema: EntityPropertiesKeysBeanSchema,
  });
}

export function getCommentProperty(client: HttpClient, params: { propertyKey: string; commentId: string }): Promise<EntityPropertyBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/comment/${params.commentId}/properties/${params.propertyKey}`,
    schema: EntityPropertyBeanSchema,
  });
}

export function getComments(client: HttpClient, params: { issueIdOrKey: string; expand?: string; maxResults?: string; orderBy?: string; startAt?: string }): Promise<CommentsWithPaginationJsonBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/comment`,
    searchParams: { expand: params.expand, maxResults: params.maxResults, orderBy: params.orderBy, startAt: params.startAt },
    schema: CommentsWithPaginationJsonBeanSchema,
  });
}

export function getCreateIssueMetaFields(client: HttpClient, params: { issueTypeId: string; projectIdOrKey: string; maxResults?: string; startAt?: string }): Promise<FieldMetaBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/createmeta/${params.projectIdOrKey}/issuetypes/${params.issueTypeId}`,
    searchParams: { maxResults: params.maxResults, startAt: params.startAt },
    schema: FieldMetaBeanSchema,
  });
}

export function getCreateIssueMetaProjectIssueTypes(client: HttpClient, params: { projectIdOrKey: string; maxResults?: string; startAt?: string }): Promise<CreateMetaIssueTypeBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/createmeta/${params.projectIdOrKey}/issuetypes`,
    searchParams: { maxResults: params.maxResults, startAt: params.startAt },
    schema: CreateMetaIssueTypeBeanSchema,
  });
}

export function getEditIssueMeta(client: HttpClient, params: { issueIdOrKey: string }): Promise<EditMetaBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/editmeta`,
    schema: EditMetaBeanSchema,
  });
}

export function getIdsOfWorklogsDeletedSince(client: HttpClient, params: { since?: number }): Promise<WorklogChangedSinceBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/worklog/deleted`,
    searchParams: { since: params.since },
    schema: WorklogChangedSinceBeanSchema,
  });
}

export function getIdsOfWorklogsModifiedSince(client: HttpClient, params: { since?: number }): Promise<WorklogChangedSinceBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/worklog/updated`,
    searchParams: { since: params.since },
    schema: WorklogChangedSinceBeanSchema,
  });
}

export function getIssue(client: HttpClient, params: { issueIdOrKey: string; expand?: string; fields?: Array<StringList>; updateHistory?: boolean }): Promise<IssueBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/issue/${params.issueIdOrKey}`,
    searchParams: { expand: params.expand, fields: params.fields, updateHistory: params.updateHistory },
    schema: IssueBeanSchema,
  });
}

export function getIssueLink(client: HttpClient, params: { linkId: string }): Promise<issueLinks> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issueLink/${params.linkId}`,
    schema: issueLinksSchema,
  });
}

export function getIssueLinkTypes(client: HttpClient, _params: Record<string, never>): Promise<IssueLinkTypesBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issueLinkType`,
    schema: IssueLinkTypesBeanSchema,
  });
}

export function getIssuePropertiesKeys(client: HttpClient, params: { issueIdOrKey: string }): Promise<EntityPropertiesKeysBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/properties`,
    schema: EntityPropertiesKeysBeanSchema,
  });
}

export function getIssueProperty(client: HttpClient, params: { propertyKey: string; issueIdOrKey: string }): Promise<EntityPropertyBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/properties/${params.propertyKey}`,
    schema: EntityPropertyBeanSchema,
  });
}

export function getIssueWatchers(client: HttpClient, params: { issueIdOrKey: string }): Promise<WatchersBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/watchers`,
    schema: WatchersBeanSchema,
  });
}

export function getIssueWorklog(client: HttpClient, params: { issueIdOrKey: string }): Promise<WorklogWithPaginationBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/worklog`,
    schema: WorklogWithPaginationBeanSchema,
  });
}

export function getPinnedComments(client: HttpClient, params: { issueIdOrKey: string }): Promise<PinnedCommentJsonBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/pinned-comments`,
    schema: z.array(PinnedCommentJsonBeanSchema),
  });
}

export function getRemoteIssueLinkById(client: HttpClient, params: { linkId: string; issueIdOrKey: string }): Promise<RemoteIssueLinkBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/remotelink/${params.linkId}`,
    schema: RemoteIssueLinkBeanSchema,
  });
}

export function getRemoteIssueLinks(client: HttpClient, params: { issueIdOrKey: string; globalId?: string }): Promise<RemoteIssueLinkBean[]> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/remotelink`,
    searchParams: { globalId: params.globalId },
    schema: z.array(RemoteIssueLinkBeanSchema),
  });
}

export function getTransitions(client: HttpClient, params: { issueIdOrKey: string; transitionId?: string }): Promise<TransitionsMetaBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/transitions`,
    searchParams: { transitionId: params.transitionId },
    schema: TransitionsMetaBeanSchema,
  });
}

export function getVotes(client: HttpClient, params: { issueIdOrKey: string }): Promise<VoteBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/votes`,
    schema: VoteBeanSchema,
  });
}

export function getWorklog(client: HttpClient, params: { issueIdOrKey: string; id: string }): Promise<worklog> {
  return client.sendRequest({
    method: 'GET',
    url: route`/api/2/issue/${params.issueIdOrKey}/worklog/${params.id}`,
    schema: worklogSchema,
  });
}

export function getWorklogsForIds(client: HttpClient, params: { requestBody: WorklogIdsRequestBean }): Promise<worklog> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/worklog/list`,
    body: params.requestBody,
    schema: worklogSchema,
  });
}

export function linkIssues(client: HttpClient, params: { requestBody: LinkIssueRequestJsonBean }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issueLink`,
    body: params.requestBody,
  });
}

export function notify(client: HttpClient, params: { issueIdOrKey: string; requestBody?: NotificationJsonBean }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/issue/${params.issueIdOrKey}/notify`,
    body: params.requestBody,
  });
}

export function rankIssues(client: HttpClient, params: { requestBody: IssueRankRequestBean }): Promise<PartialSuccessBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/agile/1.0/issue/rank`,
    body: params.requestBody,
    schema: PartialSuccessBeanSchema,
  });
}

export function removeAttachment(client: HttpClient, params: { id: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/attachment/${params.id}`,
  });
}

export function removeVote(client: HttpClient, params: { issueIdOrKey: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}/votes`,
  });
}

export function removeWatcher(client: HttpClient, params: { issueIdOrKey: string; userName?: string; username?: string }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/api/2/issue/${params.issueIdOrKey}/watchers`,
    searchParams: { userName: params.userName, username: params.username },
  });
}

export function restoreIssue(client: HttpClient, params: { issueIdOrKey: string; notifyUsers?: string }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/restore`,
    searchParams: { notifyUsers: params.notifyUsers },
  });
}

export function searchByJql(client: HttpClient, params: { requestBody: SearchRequestBean }): Promise<SearchResultsBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/api/2/search`,
    body: params.requestBody,
    schema: SearchResultsBeanSchema,
  });
}

export function setCommentProperty(client: HttpClient, params: { propertyKey: string; commentId: string; requestBody?: any }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/comment/${params.commentId}/properties/${params.propertyKey}`,
    body: params.requestBody,
  });
}

export function setIssueProperty(client: HttpClient, params: { propertyKey: string; issueIdOrKey: string; requestBody: string }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/properties/${params.propertyKey}`,
    body: params.requestBody,
  });
}

export function setPinComment(client: HttpClient, params: { issueIdOrKey: string; id: string; requestBody: boolean }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/comment/${params.id}/pin`,
    body: params.requestBody,
  });
}

export function updateComment(client: HttpClient, params: { issueIdOrKey: string; id: string; expand?: string; requestBody?: CommentJsonBean }): Promise<CommentJsonBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/comment/${params.id}`,
    searchParams: { expand: params.expand },
    body: params.requestBody,
    schema: CommentJsonBeanSchema,
  });
}

export function updateIssueLinkType(client: HttpClient, params: { issueLinkTypeId: string; requestBody: IssueLinkTypeJsonBean }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issueLinkType/${params.issueLinkTypeId}`,
    body: params.requestBody,
  });
}

export function updateRemoteIssueLink(client: HttpClient, params: { linkId: string; issueIdOrKey: string; requestBody?: RemoteIssueLinkCreateOrUpdateRequest }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/remotelink/${params.linkId}`,
    body: params.requestBody,
  });
}

export function updateWorklog(client: HttpClient, params: { issueIdOrKey: string; id: string; newEstimate?: string; adjustEstimate?: string; requestBody?: worklog }): Promise<worklog> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/api/2/issue/${params.issueIdOrKey}/worklog/${params.id}`,
    searchParams: { newEstimate: params.newEstimate, adjustEstimate: params.adjustEstimate },
    body: params.requestBody,
    schema: worklogSchema,
  });
}
