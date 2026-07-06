import { route, type HttpClient } from 'datacenter-mcp-core';

export function createSiteBackupJob(client: HttpClient, params: { requestBody?: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/backup-restore/backup/site`,
    body: params.requestBody,
  });
}

export function findJobs(client: HttpClient, params: { owner?: string; spaceKey?: string; fromDate?: string; jobStates?: string; toDate?: string; jobOperation?: string; limit?: string; jobScope?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/backup-restore/jobs`,
    searchParams: {
      owner: params.owner,
      spaceKey: params.spaceKey,
      fromDate: params.fromDate,
      jobStates: params.jobStates,
      toDate: params.toDate,
      jobOperation: params.jobOperation,
      limit: params.limit,
      jobScope: params.jobScope,
    },
  });
}

export function getAccessModeStatus(client: HttpClient): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/accessmode`,
  });
}

export function getAllGlobalPermissions(client: HttpClient): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/permissions`,
  });
}

export function getAuditRecords(client: HttpClient): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/audit`,
  });
}

export function getClusterNodeStatuses(client: HttpClient, params: { limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/cluster/nodes`,
    searchParams: {
      limit: params.limit,
      start: params.start,
    },
  });
}

export function getJob(client: HttpClient, params: { jobId: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/backup-restore/jobs/${params.jobId}`,
  });
}

export function getTask(client: HttpClient, params: { id: string; expand?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/longtask/${params.id}`,
    searchParams: {
      expand: params.expand,
    },
  });
}

export function getTasks(client: HttpClient, params: { expand?: string; limit?: string; start?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/longtask`,
    searchParams: {
      expand: params.expand,
      limit: params.limit,
      start: params.start,
    },
  });
}

export function index1(client: HttpClient): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/instance-metrics`,
  });
}

export function index2(client: HttpClient): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/server-information`,
  });
}
