import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerAdminTools(server: McpServer, service: ConfluenceService) {
  server.tool(
    'confluence_getServerInfo',
    `Get build/version information about the ${confluenceInstanceType}`,
    confluenceToolSchemas.getServerInfo,
    async () => {
      const result = await service.getServerInfo();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getClusterNodes',
    `Get the status of each node in a ${confluenceInstanceType}'s cluster. Requires permission to view cluster information.`,
    confluenceToolSchemas.getClusterNodes,
    async ({ limit, start }) => {
      const result = await service.getClusterNodes(limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getLongRunningTask',
    `Get information about a single long-running background task (e.g. space export, reindex) in ${confluenceInstanceType}`,
    confluenceToolSchemas.getLongRunningTask,
    async ({ id, expand }) => {
      const result = await service.getLongRunningTask(id, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getLongRunningTasks',
    `Get all tracked long-running background tasks (e.g. space export, reindex) in ${confluenceInstanceType}`,
    confluenceToolSchemas.getLongRunningTasks,
    async ({ expand, limit, start }) => {
      const result = await service.getLongRunningTasks(expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_triggerSiteBackup',
    `Start a new site backup job in ${confluenceInstanceType}. Requires permission to create site backups.`,
    confluenceToolSchemas.triggerSiteBackup,
    async ({ settings }) => {
      const result = await service.triggerSiteBackup(settings);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getBackupRestoreJob',
    `Get a backup/restore job by ID in ${confluenceInstanceType}. Caller must be a system administrator or the job's owner.`,
    confluenceToolSchemas.getBackupRestoreJob,
    async ({ jobId }) => {
      const result = await service.getBackupRestoreJob(jobId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_findBackupRestoreJobs',
    `Find backup/restore jobs visible to the calling user in ${confluenceInstanceType}, optionally filtered`,
    confluenceToolSchemas.findBackupRestoreJobs,
    async ({ owner, spaceKey, fromDate, jobStates, toDate, jobOperation, limit, jobScope }) => {
      const result = await service.findBackupRestoreJobs(owner, spaceKey, fromDate, jobStates, toDate, jobOperation, limit, jobScope);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getInstanceMetrics',
    `Get simple metrics about the ${confluenceInstanceType} (e.g. content and user counts)`,
    confluenceToolSchemas.getInstanceMetrics,
    async () => {
      const result = await service.getInstanceMetrics();

      return formatToolResponse(result);
    },
  );
}
