import { route, type HttpClient } from 'datacenter-mcp-core';
import { BoardBeanSchema, type BoardBean, BoardConfigBeanSchema, type BoardConfigBean, EpicBeanSchema, type EpicBean, type EpicRankRequestBean, type EpicUpdateBean, type IssueAssignRequestBean, IssueBeanSchema, type IssueBean, SearchResultsBeanSchema, type SearchResultsBean, SprintBeanSchema, type SprintBean, type SprintCreateBean, type StringList, VersionBeanSchema, type VersionBean } from '../models/index.js';

export function createSprint(client: HttpClient, params: { requestBody: SprintCreateBean }): Promise<SprintBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/agile/1.0/sprint`,
    body: params.requestBody,
    schema: SprintBeanSchema,
  });
}

export function deleteSprint(client: HttpClient, params: { sprintId: number }): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/agile/1.0/sprint/${params.sprintId}`,
  });
}

export function getAllBoards(client: HttpClient, params: { maxResults?: number; name?: string; projectKeyOrId?: string; type?: StringList; startAt?: number }): Promise<BoardBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board`,
    searchParams: { maxResults: params.maxResults, name: params.name, projectKeyOrId: params.projectKeyOrId, type: params.type, startAt: params.startAt },
    schema: BoardBeanSchema,
  });
}

export function getAllSprints(client: HttpClient, params: { boardId: number; maxResults?: number; state?: StringList; startAt?: number }): Promise<SprintBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/sprint`,
    searchParams: { maxResults: params.maxResults, state: params.state, startAt: params.startAt },
    schema: SprintBeanSchema,
  });
}

export function getAllVersions(client: HttpClient, params: { boardId: number; maxResults?: number; released?: string; startAt?: number }): Promise<VersionBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/version`,
    searchParams: { maxResults: params.maxResults, released: params.released, startAt: params.startAt },
    schema: VersionBeanSchema,
  });
}

export function getBoard(client: HttpClient, params: { boardId: number }): Promise<BoardBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}`,
    schema: BoardBeanSchema,
  });
}

export function getBoardIssuesForEpic(client: HttpClient, params: { epicId: number; boardId: number; expand?: string; jql?: string; maxResults?: number; validateQuery?: boolean; fields?: Array<StringList>; startAt?: number }): Promise<SearchResultsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/epic/${params.epicId}/issue`,
    searchParams: { expand: params.expand, jql: params.jql, maxResults: params.maxResults, validateQuery: params.validateQuery, fields: params.fields, startAt: params.startAt },
    schema: SearchResultsBeanSchema,
  });
}

export function getConfiguration(client: HttpClient, params: { boardId: number }): Promise<BoardConfigBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/configuration`,
    schema: BoardConfigBeanSchema,
  });
}

export function getEpic(client: HttpClient, params: { epicIdOrKey: string }): Promise<EpicBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/epic/${params.epicIdOrKey}`,
    schema: EpicBeanSchema,
  });
}

export function getEpicIssuesForEpic(client: HttpClient, params: { epicIdOrKey: string; expand?: string; jql?: string; maxResults?: number; validateQuery?: boolean; fields?: Array<StringList>; startAt?: number }): Promise<SearchResultsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/epic/${params.epicIdOrKey}/issue`,
    searchParams: { expand: params.expand, jql: params.jql, maxResults: params.maxResults, validateQuery: params.validateQuery, fields: params.fields, startAt: params.startAt },
    schema: SearchResultsBeanSchema,
  });
}

export function getEpics(client: HttpClient, params: { boardId: number; maxResults?: number; done?: string; startAt?: number }): Promise<EpicBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/epic`,
    searchParams: { maxResults: params.maxResults, done: params.done, startAt: params.startAt },
    schema: EpicBeanSchema,
  });
}

export function getIssuesForBacklog(client: HttpClient, params: { boardId: number; expand?: string; jql?: string; maxResults?: number; validateQuery?: boolean; fields?: Array<StringList>; startAt?: number }): Promise<SearchResultsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/backlog`,
    searchParams: { expand: params.expand, jql: params.jql, maxResults: params.maxResults, validateQuery: params.validateQuery, fields: params.fields, startAt: params.startAt },
    schema: SearchResultsBeanSchema,
  });
}

export function getIssuesForBoard(client: HttpClient, params: { boardId: number; expand?: string; jql?: string; maxResults?: number; validateQuery?: boolean; fields?: Array<StringList>; startAt?: number }): Promise<SearchResultsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/issue`,
    searchParams: { expand: params.expand, jql: params.jql, maxResults: params.maxResults, validateQuery: params.validateQuery, fields: params.fields, startAt: params.startAt },
    schema: SearchResultsBeanSchema,
  });
}

export function getIssuesForSprint(client: HttpClient, params: { sprintId: number; expand?: string; jql?: string; maxResults?: number; validateQuery?: boolean; fields?: Array<StringList>; startAt?: number }): Promise<SearchResultsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/sprint/${params.sprintId}/issue`,
    searchParams: { expand: params.expand, jql: params.jql, maxResults: params.maxResults, validateQuery: params.validateQuery, fields: params.fields, startAt: params.startAt },
    schema: SearchResultsBeanSchema,
  });
}

export function getIssuesWithoutEpic(client: HttpClient, params: { boardId: number; expand?: string; jql?: string; maxResults?: number; validateQuery?: boolean; fields?: Array<StringList>; startAt?: number }): Promise<SearchResultsBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/board/${params.boardId}/epic/none/issue`,
    searchParams: { expand: params.expand, jql: params.jql, maxResults: params.maxResults, validateQuery: params.validateQuery, fields: params.fields, startAt: params.startAt },
    schema: SearchResultsBeanSchema,
  });
}

export function getSprint(client: HttpClient, params: { sprintId: number }): Promise<SprintBean> {
  return client.sendRequest({
    method: 'GET',
    url: route`/agile/1.0/sprint/${params.sprintId}`,
    schema: SprintBeanSchema,
  });
}

export function moveIssuesToBacklog(client: HttpClient, params: { requestBody: IssueAssignRequestBean }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/agile/1.0/backlog/issue`,
    body: params.requestBody,
  });
}

export function moveIssuesToEpic(client: HttpClient, params: { epicIdOrKey: string; requestBody: IssueAssignRequestBean }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/agile/1.0/epic/${params.epicIdOrKey}/issue`,
    body: params.requestBody,
  });
}

export function moveIssuesToSprint(client: HttpClient, params: { sprintId: number; requestBody: IssueAssignRequestBean }): Promise<void> {
  return client.sendRequest({
    method: 'POST',
    url: route`/agile/1.0/sprint/${params.sprintId}/issue`,
    body: params.requestBody,
  });
}

export function partiallyUpdateEpic(client: HttpClient, params: { epicIdOrKey: string; requestBody: EpicUpdateBean }): Promise<EpicBean> {
  return client.sendRequest({
    method: 'POST',
    url: route`/agile/1.0/epic/${params.epicIdOrKey}`,
    body: params.requestBody,
    schema: EpicBeanSchema,
  });
}

export function rankEpics(client: HttpClient, params: { epicIdOrKey: string; requestBody: EpicRankRequestBean }): Promise<void> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/agile/1.0/epic/${params.epicIdOrKey}/rank`,
    body: params.requestBody,
  });
}

export function updateSprint(client: HttpClient, params: { sprintId: number; requestBody: SprintBean }): Promise<SprintBean> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/agile/1.0/sprint/${params.sprintId}`,
    body: params.requestBody,
    schema: SprintBeanSchema,
  });
}
