import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerWebhookTools(server: McpServer, service: ConfluenceService) {
  server.tool(
    'confluence_findWebhooks',
    `Find webhooks in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.findWebhooks,
    async ({ limit, start, event, statistics }) => {
      const result = await service.findWebhooks(limit, start, event, statistics);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_createWebhook',
    `Create a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.createWebhook,
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

  server.tool(
    'confluence_getWebhook',
    `Get a webhook by ID in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.getWebhook,
    async ({ webhookId, statistics }) => {
      const result = await service.getWebhook(webhookId, statistics);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_updateWebhook',
    `Update an existing webhook in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.updateWebhook,
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

  server.tool(
    'confluence_deleteWebhook',
    `Delete a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.deleteWebhook,
    async ({ webhookId }) => {
      const result = await service.deleteWebhook(webhookId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getWebhookLatestInvocation',
    `Get the latest invocation of a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.getWebhookLatestInvocation,
    async ({ webhookId, outcomes, event }) => {
      const result = await service.getWebhookLatestInvocation(webhookId, outcomes, event);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getWebhookStatistics',
    `Get invocation statistics for a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.getWebhookStatistics,
    async ({ webhookId, event }) => {
      const result = await service.getWebhookStatistics(webhookId, event);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getWebhookStatisticsSummary',
    `Get the invocation statistics summary for a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.getWebhookStatisticsSummary,
    async ({ webhookId }) => {
      const result = await service.getWebhookStatisticsSummary(webhookId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_testWebhook',
    `Test connectivity to a webhook endpoint URL in ${confluenceInstanceType}. Requires administrator permission.`,
    confluenceToolSchemas.testWebhook,
    async ({ url }) => {
      const result = await service.testWebhook(url);

      return formatToolResponse(result);
    },
  );
}
