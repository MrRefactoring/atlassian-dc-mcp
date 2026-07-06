import { route, type HttpClient } from 'datacenter-mcp-core';
import type { Content, MockAttachmentRequest } from '../models.js';

export function createAttachments(client: HttpClient, params: { id: string; expand?: string; allowDuplicated?: string; status?: string; formData?: MockAttachmentRequest }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/content/${params.id}/child/attachment`,
    searchParams: { expand: params.expand, allowDuplicated: params.allowDuplicated, status: params.status },
    formData: params.formData as Record<string, unknown> | undefined,
  });
}

export function getAttachments(client: HttpClient, params: { id: string; expand?: string; filename?: string; limit?: string; start?: string; mediaType?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/content/${params.id}/child/attachment`,
    searchParams: { expand: params.expand, filename: params.filename, limit: params.limit, start: params.start, mediaType: params.mediaType },
  });
}

export function move(client: HttpClient, params: { attachmentId: string; id: string; newName?: string; newContentId?: string }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/content/${params.id}/child/attachment/${params.attachmentId}/move`,
    searchParams: { newName: params.newName, newContentId: params.newContentId },
  });
}

export function removeAttachment(client: HttpClient, params: { attachmentId: string; id: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/content/${params.id}/child/attachment/${params.attachmentId}`,
  });
}

export function removeAttachmentVersion(client: HttpClient, params: { attachmentId: string; id: string; version: number }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/content/${params.id}/child/attachment/${params.attachmentId}/version/${params.version}`,
  });
}

export function update(client: HttpClient, params: { attachmentId: string; id: string; requestBody?: Content }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/content/${params.id}/child/attachment/${params.attachmentId}`,
    body: params.requestBody,
  });
}

export function updateData(client: HttpClient, params: { attachmentId: string; id: string; formData?: MockAttachmentRequest }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/content/${params.id}/child/attachment/${params.attachmentId}/data`,
    formData: params.formData as Record<string, unknown> | undefined,
  });
}
