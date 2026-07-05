import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerBuildTools(server: McpServer, service: BitbucketService) {
  server.registerTool(
    'bitbucket_listBuildStatuses',
    {
      description: 'List build statuses (CI results) for a commit. NOTE: build statuses are keyed globally by commit id, so this does not take a project/repository.',
      inputSchema: bitbucketToolSchemas.listBuildStatuses,
    },
    async ({ commitId, orderBy, start, limit }) => {
      const result = await service.listBuildStatuses(commitId, orderBy, start, limit);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_addBuildStatus',
    {
      description: 'Add (or update) a build status (CI result) on a commit. state is SUCCESSFUL, FAILED, or INPROGRESS; key uniquely identifies the build and url links to its result.',
      inputSchema: bitbucketToolSchemas.addBuildStatus,
    },
    async ({ projectKey, repositorySlug, commitId, state, key, url, name, description }) => {
      const result = await service.addBuildStatus(projectKey, repositorySlug, commitId, state, key, url, name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_getBuildStatus',
    {
      description: 'Get a single build status for a commit by its key.',
      inputSchema: bitbucketToolSchemas.getBuildStatus,
    },
    async ({ projectKey, repositorySlug, commitId, key }) => {
      const result = await service.getBuildStatus(projectKey, repositorySlug, commitId, key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_setInsightReport',
    {
      description: 'Create or replace a Code Insights report on a commit (e.g. linter/scanner results). The report \'key\' must be unique and namespaced. Use bitbucket_addInsightAnnotations to attach per-line findings.',
      inputSchema: bitbucketToolSchemas.setInsightReport,
    },
    async ({ projectKey, repositorySlug, commitId, key, report }) => {
      const result = await service.setInsightReport(projectKey, repositorySlug, commitId, key, report);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_getInsightReport',
    {
      description: 'Get a Code Insights report on a commit by its key.',
      inputSchema: bitbucketToolSchemas.getInsightReport,
    },
    async ({ projectKey, repositorySlug, commitId, key }) => {
      const result = await service.getInsightReport(projectKey, repositorySlug, commitId, key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_deleteInsightReport',
    {
      description: 'Delete a Code Insights report (and its annotations) on a commit.',
      inputSchema: bitbucketToolSchemas.deleteInsightReport,
    },
    async ({ projectKey, repositorySlug, commitId, key }) => {
      const result = await service.deleteInsightReport(projectKey, repositorySlug, commitId, key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_addInsightAnnotations',
    {
      description: 'Add annotations (per-file/line findings) to a Code Insights report. The report must already exist (bitbucket_setInsightReport).',
      inputSchema: bitbucketToolSchemas.addInsightAnnotations,
    },
    async ({ projectKey, repositorySlug, commitId, key, annotations }) => {
      const result = await service.addInsightAnnotations(projectKey, repositorySlug, commitId, key, annotations);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_getInsightAnnotations',
    {
      description: 'Get the annotations of a Code Insights report on a commit.',
      inputSchema: bitbucketToolSchemas.getInsightAnnotations,
    },
    async ({ projectKey, repositorySlug, commitId, key }) => {
      const result = await service.getInsightAnnotations(projectKey, repositorySlug, commitId, key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_deleteInsightAnnotations',
    {
      description: 'Delete annotations of a Code Insights report. Pass externalId to delete a single annotation, or omit it to delete all.',
      inputSchema: bitbucketToolSchemas.deleteInsightAnnotations,
    },
    async ({ projectKey, repositorySlug, commitId, key, externalId }) => {
      const result = await service.deleteInsightAnnotations(projectKey, repositorySlug, commitId, key, externalId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_getRequiredBuildsMergeChecks',
    {
      description: 'List the required-builds merge checks configured for a Bitbucket repository. Each check requires green builds for the given build keys before a PR targeting the matched ref can be merged.',
      inputSchema: bitbucketToolSchemas.getRequiredBuildsMergeChecks,
    },
    async ({ projectKey, repositorySlug, start, limit }) => {
      const result = await service.getRequiredBuildsMergeChecks(projectKey, repositorySlug, start, limit);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_createRequiredBuildsMergeCheck',
    {
      description: 'Create a required-builds merge check on a Bitbucket repository. Requires REPO_ADMIN. Provide the build parent keys that must be green and a target ref matcher (type + value); optionally exempt source refs.',
      inputSchema: bitbucketToolSchemas.createRequiredBuildsMergeCheck,
    },
    async ({ projectKey, repositorySlug, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId }) => {
      const result = await service.createRequiredBuildsMergeCheck(projectKey, repositorySlug, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_updateRequiredBuildsMergeCheck',
    {
      description: 'Update a required-builds merge check on a Bitbucket repository. Requires REPO_ADMIN. This replaces the whole check, so provide the complete desired build keys and matcher.',
      inputSchema: bitbucketToolSchemas.updateRequiredBuildsMergeCheck,
    },
    async ({ projectKey, repositorySlug, id, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId }) => {
      const result = await service.updateRequiredBuildsMergeCheck(projectKey, repositorySlug, id, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'bitbucket_deleteRequiredBuildsMergeCheck',
    {
      description: 'Delete a required-builds merge check from a Bitbucket repository by its ID. Requires REPO_ADMIN.',
      inputSchema: bitbucketToolSchemas.deleteRequiredBuildsMergeCheck,
    },
    async ({ projectKey, repositorySlug, id }) => {
      const result = await service.deleteRequiredBuildsMergeCheck(projectKey, repositorySlug, id);

      return formatToolResponse(result);
    },
  );
}
