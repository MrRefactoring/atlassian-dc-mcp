import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerRepositoryTools(server: McpServer, service: BitbucketService) {
  server.tool(
    'bitbucket_getRepositories',
    'Get repositories for a Bitbucket project',
    bitbucketToolSchemas.getRepositories,
    async ({ projectKey, start, limit }) => {
      const result = await service.getRepositories(projectKey, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getRepository',
    'Get a specific Bitbucket repository',
    bitbucketToolSchemas.getRepository,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.getRepository(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createBranch',
    'Create a branch in a Bitbucket repository from a given start point (ref or commit). Useful to start a feature branch before opening a pull request.',
    bitbucketToolSchemas.createBranch,
    async ({ projectKey, repositorySlug, name, startPoint }) => {
      const result = await service.createBranch(projectKey, repositorySlug, name, startPoint);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteBranch',
    'Delete a branch in a Bitbucket repository. Pass dryRun: true to validate the deletion without performing it. WARNING: deleting a branch is irreversible once performed.',
    bitbucketToolSchemas.deleteBranch,
    async ({ projectKey, repositorySlug, name, dryRun }) => {
      const result = await service.deleteBranch(projectKey, repositorySlug, name, dryRun);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getBranches',
    'Get branches for a Bitbucket repository. Supports filtering by name substring and ordering (ALPHABETICAL or MODIFICATION). Useful before creating a pull request to discover valid source/target refs.',
    bitbucketToolSchemas.getBranches,
    async ({ projectKey, repositorySlug, filterText, orderBy, start, limit }) => {
      const result = await service.getBranches(projectKey, repositorySlug, filterText, orderBy, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getTags',
    'Get tags for a Bitbucket repository. Supports filtering by name substring and ordering (ALPHABETICAL or MODIFICATION).',
    bitbucketToolSchemas.getTags,
    async ({ projectKey, repositorySlug, filterText, orderBy, start, limit }) => {
      const result = await service.getTags(projectKey, repositorySlug, filterText, orderBy, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getDefaultBranch',
    'Get the default branch of a Bitbucket repository (e.g. main or master). Useful as the target ref when creating a pull request.',
    bitbucketToolSchemas.getDefaultBranch,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.getDefaultBranch(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getTag',
    'Get a single tag by name from a Bitbucket repository.',
    bitbucketToolSchemas.getTag,
    async ({ projectKey, repositorySlug, name }) => {
      const result = await service.getTag(projectKey, repositorySlug, name);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_editFile',
    'Create or edit a file in a Bitbucket repository and commit the change in one call (no clone needed). For an existing file, pass sourceCommitId (the commit the file was last seen at) for conflict detection; omit it to create a new file. Returns the created commit.',
    bitbucketToolSchemas.editFile,
    async ({ projectKey, repositorySlug, path, content, message, branch, sourceCommitId, sourceBranch }) => {
      const result = await service.editFile(projectKey, repositorySlug, path, content, message, branch, sourceCommitId, sourceBranch);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createTag',
    'Create a tag in a Bitbucket repository pointing at a ref or commit. Provide a message to create an annotated tag.',
    bitbucketToolSchemas.createTag,
    async ({ projectKey, repositorySlug, name, startPoint, message }) => {
      const result = await service.createTag(projectKey, repositorySlug, name, startPoint, message);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getCommits',
    'Get commits for a Bitbucket repository',
    bitbucketToolSchemas.getCommits,
    async ({ projectKey, repositorySlug, path, since, until, limit }) => {
      const result = await service.getCommits(projectKey, repositorySlug, path, since, until, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getCommit',
    'Get a single commit by its id (hash) from a Bitbucket repository. Returns author, message, parents, and timestamps.',
    bitbucketToolSchemas.getCommit,
    async ({ projectKey, repositorySlug, commitId, path }) => {
      const result = await service.getCommit(projectKey, repositorySlug, commitId, path);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getFileContent',
    'Get the raw text content of a file in a Bitbucket repository at a given ref or commit. Lets you read source files without cloning. Defaults to the repository\'s default branch when \'at\' is omitted.',
    bitbucketToolSchemas.getFileContent,
    async ({ projectKey, repositorySlug, path, at }) => {
      const result = await service.getFileContent(projectKey, repositorySlug, path, at);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getCommitDiff',
    'Get the diff of a single commit in a Bitbucket repository. Pass \'path\' to limit the diff to one file, or omit it for the whole-commit diff.',
    bitbucketToolSchemas.getCommitDiff,
    async ({ projectKey, repositorySlug, commitId, path, contextLines, whitespace, srcPath }) => {
      const result = await service.getCommitDiff(projectKey, repositorySlug, commitId, path, contextLines, whitespace, srcPath);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getCommitComments',
    'Get comments on a commit in a Bitbucket repository. A file path is required — Bitbucket only returns commit comments scoped to a file.',
    bitbucketToolSchemas.getCommitComments,
    async ({ projectKey, repositorySlug, commitId, path, since, start, limit }) => {
      const result = await service.getCommitComments(projectKey, repositorySlug, commitId, path, since, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_addCommitComment',
    'Add a comment to a commit in a Bitbucket repository. Provide a path (and optionally a line) to anchor the comment to a file.',
    bitbucketToolSchemas.addCommitComment,
    async ({ projectKey, repositorySlug, commitId, text, path, line, lineType }) => {
      const result = await service.addCommitComment(projectKey, repositorySlug, commitId, text, path, line, lineType);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_compareRefs',
    'Compare two refs/commits in a Bitbucket repository. compareType \'commits\' (default) lists the commits between them; \'changes\' lists the changed files. Supports cross-repository comparison via fromRepo.',
    bitbucketToolSchemas.compareRefs,
    async ({ projectKey, repositorySlug, from, to, fromRepo, compareType, start, limit }) => {
      const result = await service.compareRefs(projectKey, repositorySlug, from, to, fromRepo, compareType, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_browseRepository',
    'Browse a repository path in a Bitbucket repository. Omit \'path\' (or pass empty) to list the root directory; a directory path lists its children; a file path returns the file content as paginated lines. Use \'type: true\' to fetch only the node type (FILE/DIRECTORY/SUBMODULE).',
    bitbucketToolSchemas.browseRepository,
    async ({ projectKey, repositorySlug, path, at, type, blame }) => {
      const result = await service.browseRepository(projectKey, repositorySlug, path, at, type, blame);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getBranchRestrictions',
    'List the branch (ref) restrictions configured for a Bitbucket repository. Requires REPO_ADMIN. Optionally filter by matcher type/id and restriction type.',
    bitbucketToolSchemas.getBranchRestrictions,
    async ({ projectKey, repositorySlug, matcherType, matcherId, type, start, limit }) => {
      const result = await service.getBranchRestrictions(projectKey, repositorySlug, matcherType, matcherId, type, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getWebhooks',
    'List webhooks configured on a Bitbucket repository. Requires REPO_ADMIN permission. Optionally filter by event ID and include invocation statistics.',
    bitbucketToolSchemas.getWebhooks,
    async ({ projectKey, repositorySlug, event, statistics }) => {
      const result = await service.getWebhooks(projectKey, repositorySlug, event, statistics);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createRepository',
    'Create a new repository in a Bitbucket project. Requires REPO_CREATE permission on the project. SCM defaults to \'git\'.',
    bitbucketToolSchemas.createRepository,
    async ({ projectKey, name, scmId, defaultBranch }) => {
      const result = await service.createRepository(projectKey, name, scmId, defaultBranch);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getWebhook',
    'Get a single Bitbucket repository webhook by its ID. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.getWebhook,
    async ({ projectKey, repositorySlug, webhookId, statistics }) => {
      const result = await service.getWebhook(projectKey, repositorySlug, webhookId, statistics);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createWebhook',
    'Create a webhook on a Bitbucket repository. Requires REPO_ADMIN permission. Provide the target URL and a list of event IDs to subscribe to (e.g. \'repo:refs_changed\', \'pr:opened\', \'pr:merged\').',
    bitbucketToolSchemas.createWebhook,
    async ({ projectKey, repositorySlug, name, url, events, active, secret, sslVerificationRequired }) => {
      const result = await service.createWebhook(projectKey, repositorySlug, name, url, events, active, secret, sslVerificationRequired);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_updateRepository',
    'Update a Bitbucket repository: rename it, change its description or default branch, or move it to another project. Requires REPO_ADMIN permission. Only the provided fields are changed.',
    bitbucketToolSchemas.updateRepository,
    async ({ projectKey, repositorySlug, name, description, defaultBranch, targetProjectKey }) => {
      const result = await service.updateRepository(projectKey, repositorySlug, name, description, defaultBranch, targetProjectKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_updateWebhook',
    'Update an existing Bitbucket repository webhook. Requires REPO_ADMIN permission. This replaces the webhook configuration, including its event set, so pass the full desired name/url/events.',
    bitbucketToolSchemas.updateWebhook,
    async ({ projectKey, repositorySlug, webhookId, name, url, events, active, secret, sslVerificationRequired }) => {
      const result = await service.updateWebhook(projectKey, repositorySlug, webhookId, name, url, events, active, secret, sslVerificationRequired);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_forkRepository',
    'Fork an existing Bitbucket repository. Requires REPO_READ on the origin and PROJECT_ADMIN on the target project. Without a target project the fork goes to the user\'s personal project.',
    bitbucketToolSchemas.forkRepository,
    async ({ projectKey, repositorySlug, name, targetProjectKey, defaultBranch }) => {
      const result = await service.forkRepository(projectKey, repositorySlug, name, targetProjectKey, defaultBranch);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getRepositoryForks',
    'List the direct forks of a Bitbucket repository. Only looks one level deep — forks of forks are not included. Only repositories the authenticated user has REPO_READ on are returned.',
    bitbucketToolSchemas.getRepositoryForks,
    async ({ projectKey, repositorySlug, start, limit }) => {
      const result = await service.getRepositoryForks(projectKey, repositorySlug, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createBranchRestriction',
    'Create a branch (ref) restriction (branch permission) on a Bitbucket repository. Requires REPO_ADMIN. The matcher is specified by type (ANY_REF/BRANCH/PATTERN/MODEL_CATEGORY/MODEL_BRANCH) and value; optionally exempt users, groups, or access keys.',
    bitbucketToolSchemas.createBranchRestriction,
    async ({ projectKey, repositorySlug, type, matcherType, matcherValue, matcherDisplayId, exemptUserSlugs, exemptGroupNames, exemptAccessKeyIds }) => {
      const result = await service.createBranchRestriction(projectKey, repositorySlug, type, matcherType, matcherValue, matcherDisplayId, exemptUserSlugs, exemptGroupNames, exemptAccessKeyIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getBranchRestriction',
    'Get a single branch (ref) restriction from a Bitbucket repository by its ID. Requires REPO_ADMIN.',
    bitbucketToolSchemas.getBranchRestriction,
    async ({ projectKey, repositorySlug, id }) => {
      const result = await service.getBranchRestriction(projectKey, repositorySlug, id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteBranchRestriction',
    'Delete a branch (ref) restriction from a Bitbucket repository by its ID. Requires REPO_ADMIN.',
    bitbucketToolSchemas.deleteBranchRestriction,
    async ({ projectKey, repositorySlug, id }) => {
      const result = await service.deleteBranchRestriction(projectKey, repositorySlug, id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getBranchModel',
    'Get the branch model configuration for a Bitbucket repository: the development and production branches, and the prefix/enabled settings for bugfix, feature, hotfix and release branch types.',
    bitbucketToolSchemas.getBranchModel,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.getBranchModel(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_setBranchModel',
    'Set (replace) the branch model configuration for a Bitbucket repository. Requires REPO_ADMIN. \'development\' is required; \'production\' and \'types\' (branch prefixes) are optional and fall back to the server defaults when omitted.',
    bitbucketToolSchemas.setBranchModel,
    async ({ projectKey, repositorySlug, development, production, types }) => {
      const result = await service.setBranchModel(projectKey, repositorySlug, development, production, types);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteBranchModel',
    'Delete (reset to server defaults) the branch model configuration for a Bitbucket repository. Requires REPO_ADMIN.',
    bitbucketToolSchemas.deleteBranchModel,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.deleteBranchModel(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_searchCode',
    'Search code across Bitbucket. The query supports search modifiers like \'project:<key>\', \'repo:<key>/<slug>\', and \'ext:<extension>\' to scope or filter results (e.g. \'project:TEST authenticate\', \'repo:TEST/demo ext:js TODO\'). NOTE: the \'repo:\' modifier requires the project key — \'repo:projectkey/repositoryslug\', not a bare slug. Returns matching files with hit contexts (snippets).',
    bitbucketToolSchemas.searchCode,
    async ({ query, limit, secondaryLimit }) => {
      const result = await service.searchCode(query, limit, secondaryLimit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteRepository',
    'Schedule a Bitbucket repository for deletion. Requires REPO_ADMIN (or the configured delete policy) permission. This is irreversible — the repository and its contents are removed.',
    bitbucketToolSchemas.deleteRepository,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.deleteRepository(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteWebhook',
    'Delete a webhook from a Bitbucket repository by its ID. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.deleteWebhook,
    async ({ projectKey, repositorySlug, webhookId }) => {
      const result = await service.deleteWebhook(projectKey, repositorySlug, webhookId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_setDefaultBranch',
    'Set the default branch of a Bitbucket repository. Requires REPO_ADMIN permission. Pass the full ref ID of the branch (e.g. \'refs/heads/main\').',
    bitbucketToolSchemas.setDefaultBranch,
    async ({ projectKey, repositorySlug, branchId }) => {
      const result = await service.setDefaultBranch(projectKey, repositorySlug, branchId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getPullRequestSettings',
    'Get the pull request settings for a Bitbucket repository, including merge strategy configuration and merge checks (required approvers, required tasks, required builds).',
    bitbucketToolSchemas.getPullRequestSettings,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.getPullRequestSettings(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_updatePullRequestSettings',
    'Update the pull request settings for a Bitbucket repository. Requires REPO_ADMIN permission. Only the provided keys are changed (e.g. mergeConfig, requiredApprovers, requiredAllApprovers, requiredAllTasksComplete, requiredSuccessfulBuilds).',
    bitbucketToolSchemas.updatePullRequestSettings,
    async ({ projectKey, repositorySlug, settings }) => {
      const result = await service.updatePullRequestSettings(projectKey, repositorySlug, settings);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getAutoDeclineSettings',
    'Get the auto-decline settings for a Bitbucket repository: whether inactive pull requests are automatically declined, and after how many weeks of inactivity. Falls back to project or default settings if none are set on the repository.',
    bitbucketToolSchemas.getAutoDeclineSettings,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.getAutoDeclineSettings(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_setAutoDeclineSettings',
    'Create or update the auto-decline settings for a Bitbucket repository. Requires REPO_ADMIN permission. inactivityWeeks must be one of 1, 2, 4, 8, or 12.',
    bitbucketToolSchemas.setAutoDeclineSettings,
    async ({ projectKey, repositorySlug, enabled, inactivityWeeks }) => {
      const result = await service.setAutoDeclineSettings(projectKey, repositorySlug, enabled, inactivityWeeks);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteAutoDeclineSettings',
    'Delete the auto-decline settings for a Bitbucket repository, reverting it to the project or default settings. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.deleteAutoDeclineSettings,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.deleteAutoDeclineSettings(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getAutoMergeSettings',
    'Get the pull request auto-merge settings for a Bitbucket repository: whether pull requests are automatically merged once all merge checks pass. Falls back to project or default settings if none are set on the repository.',
    bitbucketToolSchemas.getAutoMergeSettings,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.getAutoMergeSettings(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_setAutoMergeSettings',
    'Create or update the pull request auto-merge settings for a Bitbucket repository. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.setAutoMergeSettings,
    async ({ projectKey, repositorySlug, enabled }) => {
      const result = await service.setAutoMergeSettings(projectKey, repositorySlug, enabled);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteAutoMergeSettings',
    'Delete the pull request auto-merge settings for a Bitbucket repository, reverting it to the project or default settings. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.deleteAutoMergeSettings,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.deleteAutoMergeSettings(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getRepoHooks',
    'List the repository hooks (pre-receive/post-receive) configured for a Bitbucket repository, with their enabled state. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.getRepoHooks,
    async ({ projectKey, repositorySlug, type, start, limit }) => {
      const result = await service.getRepoHooks(projectKey, repositorySlug, type, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_enableRepoHook',
    'Enable a repository hook on a Bitbucket repository by its hook key. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.enableRepoHook,
    async ({ projectKey, repositorySlug, hookKey }) => {
      const result = await service.enableRepoHook(projectKey, repositorySlug, hookKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_disableRepoHook',
    'Disable a repository hook on a Bitbucket repository by its hook key. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.disableRepoHook,
    async ({ projectKey, repositorySlug, hookKey }) => {
      const result = await service.disableRepoHook(projectKey, repositorySlug, hookKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getRepoHookSettings',
    'Get the settings document for a repository hook on a Bitbucket repository. The structure of the settings is decided by the hook\'s plugin. Requires REPO_ADMIN permission.',
    bitbucketToolSchemas.getRepoHookSettings,
    async ({ projectKey, repositorySlug, hookKey }) => {
      const result = await service.getRepoHookSettings(projectKey, repositorySlug, hookKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_setRepoHookSettings',
    'Update the settings document for a repository hook on a Bitbucket repository. Requires REPO_ADMIN permission. The structure of the settings is decided by the hook\'s plugin; the settings document is limited to 32KB once serialized.',
    bitbucketToolSchemas.setRepoHookSettings,
    async ({ projectKey, repositorySlug, hookKey, settings }) => {
      const result = await service.setRepoHookSettings(projectKey, repositorySlug, hookKey, settings);

      return formatToolResponse(result);
    },
  );
}
