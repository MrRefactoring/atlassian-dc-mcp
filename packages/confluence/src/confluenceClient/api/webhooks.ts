import { route, type HttpClient } from 'datacenter-mcp-core';

export function createWebhook(client: HttpClient, params: { requestBody: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/webhooks`,
    body: params.requestBody,
  });
}

export function deleteWebhook(client: HttpClient, params: { webhookId: string }): Promise<any> {
  return client.sendRequest({
    method: 'DELETE',
    url: route`/rest/api/webhooks/${params.webhookId}`,
  });
}

export function findWebhooks(client: HttpClient, params: { limit?: string; start?: string; event?: string; statistics?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/webhooks`,
    searchParams: {
      limit: params.limit,
      start: params.start,
      event: params.event,
      statistics: params.statistics,
    },
  });
}

export function getLatestInvocation(client: HttpClient, params: { webhookId: string; outcomes?: string; event?: string; outcome?: Array<string> }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/webhooks/${params.webhookId}/latest`,
    searchParams: {
      outcomes: params.outcomes,
      event: params.event,
      outcome: params.outcome,
    },
  });
}

export function getStatistics(client: HttpClient, params: { webhookId: string; event?: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/webhooks/${params.webhookId}/statistics`,
    searchParams: {
      event: params.event,
    },
  });
}

export function getStatisticsSummary(client: HttpClient, params: { webhookId: string }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/webhooks/${params.webhookId}/statistics/summary`,
  });
}

export function getWebhook(client: HttpClient, params: { webhookId: string; statistics?: boolean }): Promise<any> {
  return client.sendRequest({
    method: 'GET',
    url: route`/rest/api/webhooks/${params.webhookId}`,
    searchParams: {
      statistics: params.statistics,
    },
  });
}

export function testWebhook(client: HttpClient, params: { url: string }): Promise<any> {
  return client.sendRequest({
    method: 'POST',
    url: route`/rest/api/webhooks/test`,
    searchParams: {
      url: params.url,
    },
  });
}

export function updateWebhook(client: HttpClient, params: { webhookId: string; requestBody: unknown }): Promise<any> {
  return client.sendRequest({
    method: 'PUT',
    url: route`/rest/api/webhooks/${params.webhookId}`,
    body: params.requestBody,
  });
}
