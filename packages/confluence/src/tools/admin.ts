import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerAdminTools(server: McpServer, service: ConfluenceService) {
  server.registerTool(
    'confluence_getServerInfo',
    {
      description: `Get build/version information about the ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getServerInfo,
    },
    async () => {
      const result = await service.getServerInfo();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getClusterNodes',
    {
      description: `Get the status of each node in a ${confluenceInstanceType}'s cluster. Requires permission to view cluster information.`,
      inputSchema: confluenceToolSchemas.getClusterNodes,
    },
    async ({ limit, start }) => {
      const result = await service.getClusterNodes(limit, start);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getLongRunningTask',
    {
      description: `Get information about a single long-running background task (e.g. space export, reindex) in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getLongRunningTask,
    },
    async ({ id, expand }) => {
      const result = await service.getLongRunningTask(id, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getLongRunningTasks',
    {
      description: `Get all tracked long-running background tasks (e.g. space export, reindex) in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getLongRunningTasks,
    },
    async ({ expand, limit, start }) => {
      const result = await service.getLongRunningTasks(expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_triggerSiteBackup',
    {
      description: `Start a new site backup job in ${confluenceInstanceType}. Requires permission to create site backups.`,
      inputSchema: confluenceToolSchemas.triggerSiteBackup,
    },
    async ({ settings }) => {
      const result = await service.triggerSiteBackup(settings);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getBackupRestoreJob',
    {
      description: `Get a backup/restore job by ID in ${confluenceInstanceType}. Caller must be a system administrator or the job's owner.`,
      inputSchema: confluenceToolSchemas.getBackupRestoreJob,
    },
    async ({ jobId }) => {
      const result = await service.getBackupRestoreJob(jobId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_findBackupRestoreJobs',
    {
      description: `Find backup/restore jobs visible to the calling user in ${confluenceInstanceType}, optionally filtered`,
      inputSchema: confluenceToolSchemas.findBackupRestoreJobs,
    },
    async ({ owner, spaceKey, fromDate, jobStates, toDate, jobOperation, limit, jobScope }) => {
      const result = await service.findBackupRestoreJobs(owner, spaceKey, fromDate, jobStates, toDate, jobOperation, limit, jobScope);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getInstanceMetrics',
    {
      description: `Get simple metrics about the ${confluenceInstanceType} (e.g. content and user counts)`,
      inputSchema: confluenceToolSchemas.getInstanceMetrics,
    },
    async () => {
      const result = await service.getInstanceMetrics();

      return formatToolResponse(result);
    },
  );
}
