import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerWebhookTools(server: McpServer, service: ConfluenceService) {
  server.registerTool(
    'confluence_findWebhooks',
    {
      description: `Find webhooks in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.findWebhooks,
    },
    async ({ limit, start, event, statistics }) => {
      const result = await service.findWebhooks(limit, start, event, statistics);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_createWebhook',
    {
      description: `Create a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.createWebhook,
    },
    async ({ name, url, events, active, secret }) => {
      const result = await service.createWebhook({
        name,
        url,
        events,
        active,
        configuration: secret ? { secret } : undefined,
      });

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getWebhook',
    {
      description: `Get a webhook by ID in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.getWebhook,
    },
    async ({ webhookId, statistics }) => {
      const result = await service.getWebhook(webhookId, statistics);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_updateWebhook',
    {
      description: `Update an existing webhook in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.updateWebhook,
    },
    async ({ webhookId, name, url, events, active, secret }) => {
      const result = await service.updateWebhook(webhookId, {
        name,
        url,
        events,
        active,
        configuration: secret ? { secret } : undefined,
      });

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_deleteWebhook',
    {
      description: `Delete a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.deleteWebhook,
    },
    async ({ webhookId }) => {
      const result = await service.deleteWebhook(webhookId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getWebhookLatestInvocation',
    {
      description: `Get the latest invocation of a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.getWebhookLatestInvocation,
    },
    async ({ webhookId, outcomes, event }) => {
      const result = await service.getWebhookLatestInvocation(webhookId, outcomes, event);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getWebhookStatistics',
    {
      description: `Get invocation statistics for a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.getWebhookStatistics,
    },
    async ({ webhookId, event }) => {
      const result = await service.getWebhookStatistics(webhookId, event);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getWebhookStatisticsSummary',
    {
      description: `Get the invocation statistics summary for a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.getWebhookStatisticsSummary,
    },
    async ({ webhookId }) => {
      const result = await service.getWebhookStatisticsSummary(webhookId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_testWebhook',
    {
      description: `Test connectivity to a webhook endpoint URL in ${confluenceInstanceType}. Requires administrator permission.`,
      inputSchema: confluenceToolSchemas.testWebhook,
    },
    async ({ url }) => {
      const result = await service.testWebhook(url);

      return formatToolResponse(result);
    },
  );
}
