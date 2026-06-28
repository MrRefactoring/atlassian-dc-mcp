import { connectServer, createMcpServer, formatToolResponse, initializeRuntimeConfig } from '@mrrefactoring/atlassian-dc-mcp-core';
import { BitbucketService, bitbucketToolSchemas } from './bitbucket-service.js';
import { getBitbucketRuntimeConfig, getDefaultPageSize } from './config.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

initializeRuntimeConfig();

const missingVars = BitbucketService.validateConfig();
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const bitbucketConfig = getBitbucketRuntimeConfig();
const bitbucketService = new BitbucketService(
  bitbucketConfig.host,
  () => getBitbucketRuntimeConfig().token,
  bitbucketConfig.apiBasePath,
  getDefaultPageSize,
);

const server = createMcpServer({
  name: "atlassian-bitbucket-mcp",
  version
});

server.tool(
  "bitbucket_getProjects",
  "Get a list of Bitbucket projects",
  bitbucketToolSchemas.getProjects,
  async ({ name, permission, start, limit }) => {
    const result = await bitbucketService.getProjects(name, permission, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getProject",
  "Get a specific Bitbucket project by key",
  bitbucketToolSchemas.getProject,
  async ({ projectKey }) => {
    const result = await bitbucketService.getProject(projectKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getRepositories",
  "Get repositories for a Bitbucket project",
  bitbucketToolSchemas.getRepositories,
  async ({ projectKey, start, limit }) => {
    const result = await bitbucketService.getRepositories(projectKey, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getRepository",
  "Get a specific Bitbucket repository",
  bitbucketToolSchemas.getRepository,
  async ({ projectKey, repositorySlug }) => {
    const result = await bitbucketService.getRepository(projectKey, repositorySlug);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createBranch",
  "Create a branch in a Bitbucket repository from a given start point (ref or commit). Useful to start a feature branch before opening a pull request.",
  bitbucketToolSchemas.createBranch,
  async ({ projectKey, repositorySlug, name, startPoint }) => {
    const result = await bitbucketService.createBranch(projectKey, repositorySlug, name, startPoint);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteBranch",
  "Delete a branch in a Bitbucket repository. Pass dryRun: true to validate the deletion without performing it. WARNING: deleting a branch is irreversible once performed.",
  bitbucketToolSchemas.deleteBranch,
  async ({ projectKey, repositorySlug, name, dryRun }) => {
    const result = await bitbucketService.deleteBranch(projectKey, repositorySlug, name, dryRun);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getBranches",
  "Get branches for a Bitbucket repository. Supports filtering by name substring and ordering (ALPHABETICAL or MODIFICATION). Useful before creating a pull request to discover valid source/target refs.",
  bitbucketToolSchemas.getBranches,
  async ({ projectKey, repositorySlug, filterText, orderBy, start, limit }) => {
    const result = await bitbucketService.getBranches(projectKey, repositorySlug, filterText, orderBy, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getTags",
  "Get tags for a Bitbucket repository. Supports filtering by name substring and ordering (ALPHABETICAL or MODIFICATION).",
  bitbucketToolSchemas.getTags,
  async ({ projectKey, repositorySlug, filterText, orderBy, start, limit }) => {
    const result = await bitbucketService.getTags(projectKey, repositorySlug, filterText, orderBy, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getDefaultBranch",
  "Get the default branch of a Bitbucket repository (e.g. main or master). Useful as the target ref when creating a pull request.",
  bitbucketToolSchemas.getDefaultBranch,
  async ({ projectKey, repositorySlug }) => {
    const result = await bitbucketService.getDefaultBranch(projectKey, repositorySlug);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getTag",
  "Get a single tag by name from a Bitbucket repository.",
  bitbucketToolSchemas.getTag,
  async ({ projectKey, repositorySlug, name }) => {
    const result = await bitbucketService.getTag(projectKey, repositorySlug, name);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_editFile",
  "Create or edit a file in a Bitbucket repository and commit the change in one call (no clone needed). For an existing file, pass sourceCommitId (the commit the file was last seen at) for conflict detection; omit it to create a new file. Returns the created commit.",
  bitbucketToolSchemas.editFile,
  async ({ projectKey, repositorySlug, path, content, message, branch, sourceCommitId, sourceBranch }) => {
    const result = await bitbucketService.editFile(projectKey, repositorySlug, path, content, message, branch, sourceCommitId, sourceBranch);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createTag",
  "Create a tag in a Bitbucket repository pointing at a ref or commit. Provide a message to create an annotated tag.",
  bitbucketToolSchemas.createTag,
  async ({ projectKey, repositorySlug, name, startPoint, message }) => {
    const result = await bitbucketService.createTag(projectKey, repositorySlug, name, startPoint, message);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getCommits",
  "Get commits for a Bitbucket repository",
  bitbucketToolSchemas.getCommits,
  async ({ projectKey, repositorySlug, path, since, until, limit }) => {
    const result = await bitbucketService.getCommits(projectKey, repositorySlug, path, since, until, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getCommit",
  "Get a single commit by its id (hash) from a Bitbucket repository. Returns author, message, parents, and timestamps.",
  bitbucketToolSchemas.getCommit,
  async ({ projectKey, repositorySlug, commitId, path }) => {
    const result = await bitbucketService.getCommit(projectKey, repositorySlug, commitId, path);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getFileContent",
  "Get the raw text content of a file in a Bitbucket repository at a given ref or commit. Lets you read source files without cloning. Defaults to the repository's default branch when 'at' is omitted.",
  bitbucketToolSchemas.getFileContent,
  async ({ projectKey, repositorySlug, path, at }) => {
    const result = await bitbucketService.getFileContent(projectKey, repositorySlug, path, at);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getCommitDiff",
  "Get the diff of a single commit in a Bitbucket repository. Pass 'path' to limit the diff to one file, or omit it for the whole-commit diff.",
  bitbucketToolSchemas.getCommitDiff,
  async ({ projectKey, repositorySlug, commitId, path, contextLines, whitespace, srcPath }) => {
    const result = await bitbucketService.getCommitDiff(projectKey, repositorySlug, commitId, path, contextLines, whitespace, srcPath);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_listBuildStatuses",
  "List build statuses (CI results) for a commit. NOTE: build statuses are keyed globally by commit id, so this does not take a project/repository.",
  bitbucketToolSchemas.listBuildStatuses,
  async ({ commitId, orderBy, start, limit }) => {
    const result = await bitbucketService.listBuildStatuses(commitId, orderBy, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getCommitComments",
  "Get comments on a commit in a Bitbucket repository. A file path is required — Bitbucket only returns commit comments scoped to a file.",
  bitbucketToolSchemas.getCommitComments,
  async ({ projectKey, repositorySlug, commitId, path, since, start, limit }) => {
    const result = await bitbucketService.getCommitComments(projectKey, repositorySlug, commitId, path, since, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_addBuildStatus",
  "Add (or update) a build status (CI result) on a commit. state is SUCCESSFUL, FAILED, or INPROGRESS; key uniquely identifies the build and url links to its result.",
  bitbucketToolSchemas.addBuildStatus,
  async ({ projectKey, repositorySlug, commitId, state, key, url, name, description }) => {
    const result = await bitbucketService.addBuildStatus(projectKey, repositorySlug, commitId, state, key, url, name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getBuildStatus",
  "Get a single build status for a commit by its key.",
  bitbucketToolSchemas.getBuildStatus,
  async ({ projectKey, repositorySlug, commitId, key }) => {
    const result = await bitbucketService.getBuildStatus(projectKey, repositorySlug, commitId, key);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_setInsightReport",
  "Create or replace a Code Insights report on a commit (e.g. linter/scanner results). The report 'key' must be unique and namespaced. Use bitbucket_addInsightAnnotations to attach per-line findings.",
  bitbucketToolSchemas.setInsightReport,
  async ({ projectKey, repositorySlug, commitId, key, report }) => {
    const result = await bitbucketService.setInsightReport(projectKey, repositorySlug, commitId, key, report);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getInsightReport",
  "Get a Code Insights report on a commit by its key.",
  bitbucketToolSchemas.getInsightReport,
  async ({ projectKey, repositorySlug, commitId, key }) => {
    const result = await bitbucketService.getInsightReport(projectKey, repositorySlug, commitId, key);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteInsightReport",
  "Delete a Code Insights report (and its annotations) on a commit.",
  bitbucketToolSchemas.deleteInsightReport,
  async ({ projectKey, repositorySlug, commitId, key }) => {
    const result = await bitbucketService.deleteInsightReport(projectKey, repositorySlug, commitId, key);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_addInsightAnnotations",
  "Add annotations (per-file/line findings) to a Code Insights report. The report must already exist (bitbucket_setInsightReport).",
  bitbucketToolSchemas.addInsightAnnotations,
  async ({ projectKey, repositorySlug, commitId, key, annotations }) => {
    const result = await bitbucketService.addInsightAnnotations(projectKey, repositorySlug, commitId, key, annotations);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getInsightAnnotations",
  "Get the annotations of a Code Insights report on a commit.",
  bitbucketToolSchemas.getInsightAnnotations,
  async ({ projectKey, repositorySlug, commitId, key }) => {
    const result = await bitbucketService.getInsightAnnotations(projectKey, repositorySlug, commitId, key);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteInsightAnnotations",
  "Delete annotations of a Code Insights report. Pass externalId to delete a single annotation, or omit it to delete all.",
  bitbucketToolSchemas.deleteInsightAnnotations,
  async ({ projectKey, repositorySlug, commitId, key, externalId }) => {
    const result = await bitbucketService.deleteInsightAnnotations(projectKey, repositorySlug, commitId, key, externalId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_addCommitComment",
  "Add a comment to a commit in a Bitbucket repository. Provide a path (and optionally a line) to anchor the comment to a file.",
  bitbucketToolSchemas.addCommitComment,
  async ({ projectKey, repositorySlug, commitId, text, path, line, lineType }) => {
    const result = await bitbucketService.addCommitComment(projectKey, repositorySlug, commitId, text, path, line, lineType);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_compareRefs",
  "Compare two refs/commits in a Bitbucket repository. compareType 'commits' (default) lists the commits between them; 'changes' lists the changed files. Supports cross-repository comparison via fromRepo.",
  bitbucketToolSchemas.compareRefs,
  async ({ projectKey, repositorySlug, from, to, fromRepo, compareType, start, limit }) => {
    const result = await bitbucketService.compareRefs(projectKey, repositorySlug, from, to, fromRepo, compareType, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_browseRepository",
  "Browse a repository path in a Bitbucket repository. Omit 'path' (or pass empty) to list the root directory; a directory path lists its children; a file path returns the file content as paginated lines. Use 'type: true' to fetch only the node type (FILE/DIRECTORY/SUBMODULE).",
  bitbucketToolSchemas.browseRepository,
  async ({ projectKey, repositorySlug, path, at, type, blame }) => {
    const result = await bitbucketService.browseRepository(projectKey, repositorySlug, path, at, type, blame);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getPullRequests",
  "Get pull requests for a Bitbucket repository",
  bitbucketToolSchemas.getPullRequests,
  async ({ projectKey, repositorySlug, withAttributes, at, withProperties, draft, filterText, state, order, direction, start, limit }) => {
    const result = await bitbucketService.getPullRequests(projectKey, repositorySlug, withAttributes, at, withProperties, draft, filterText, state, order, direction, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getPullRequest",
  "Get a specific pull request by ID. Returns full details including title, description, reviewers, participants, author, source/target branches, current state, and version (needed for bitbucket_updatePullRequest).",
  bitbucketToolSchemas.getPullRequest,
  async ({ projectKey, repositorySlug, pullRequestId }) => {
    const result = await bitbucketService.getPullRequest(projectKey, repositorySlug, pullRequestId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getPR_CommentsAndAction",
  "Get comments for a Bitbucket pull request and other actions, like approvals",
  bitbucketToolSchemas.getPullRequestComments,
  async ({ projectKey, repositorySlug, pullRequestId, start, limit, output }) => {
    const result = await bitbucketService.getPullRequestCommentsAndActions(projectKey, repositorySlug, pullRequestId, start, limit, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getPullRequestChanges",
  "Get the changes for a Bitbucket pull request",
  bitbucketToolSchemas.getPullRequestChanges,
  async ({ projectKey, repositorySlug, pullRequestId, sinceId, changeScope, untilId, withComments, start, limit, output }) => {
    const result = await bitbucketService.getPullRequestChanges(projectKey, repositorySlug, pullRequestId, sinceId, changeScope, untilId, withComments, start, limit, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getUser",
  "Get a Bitbucket user by their slug, or search for users by name/email to discover their slug. Use this to resolve userSlug for bitbucket_submitPullRequestReview when it is not already known from a comment response or PR participant list.",
  bitbucketToolSchemas.getUser,
  async ({ userSlug, filter }) => {
    const result = await bitbucketService.getUser(userSlug, filter);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_postPullRequestComment",
  "Post a comment to a Bitbucket pull request. Use pending: true to create a draft comment that is only visible to you until you call bitbucket_submitPullRequestReview. NOTE: pending only works when filePath is provided (file-level or inline comments). True top-level PR comments (no filePath) are always posted live and cannot be drafted. Use severity: 'BLOCKER' to post the comment as a task — tasks must be resolved before the PR can be merged.",
  bitbucketToolSchemas.postPullRequestComment,
  async ({ projectKey, repositorySlug, pullRequestId, text, parentId, filePath, startLine, startLineType, line, lineType, pending, severity, output }) => {
    const result = await bitbucketService.postPullRequestComment(projectKey, repositorySlug, pullRequestId, text, parentId, filePath, startLine, startLineType, line, lineType, pending, severity, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_updatePullRequestComment",
  "Update an existing pull request comment. Use to edit text, change severity, or resolve/reopen it via state. On a regular comment, state: 'RESOLVED' resolves the comment thread (the 'Resolve' button in the UI) and 'OPEN' reopens it. On a BLOCKER (task) comment, 'RESOLVED' also ticks the task and 'OPEN' un-ticks it. Resolution is driven by the root comment's state. Requires the current 'version' from optimistic locking; fetch it via bitbucket_getPR_CommentsAndAction or use the version returned when the comment was created.",
  bitbucketToolSchemas.updatePullRequestComment,
  async ({ projectKey, repositorySlug, pullRequestId, commentId, version, text, state, severity, output }) => {
    const result = await bitbucketService.updatePullRequestComment(projectKey, repositorySlug, pullRequestId, commentId, version, text, state, severity, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_submitPullRequestReview",
  "Submit a pull request review, publishing all pending (draft) comments and setting the reviewer's verdict. This is equivalent to clicking 'Submit Review' in the Bitbucket UI. Use after posting comments with pending: true. To resolve userSlug: (1) check author.slug in any comment you posted this session, (2) check the reviewers/participants array from bitbucket_getPullRequest, or (3) call bitbucket_getUser with a name/email filter as a last resort.",
  bitbucketToolSchemas.submitPullRequestReview,
  async ({ projectKey, repositorySlug, pullRequestId, userSlug, status, lastReviewedCommit }) => {
    const result = await bitbucketService.submitPullRequestReview(projectKey, repositorySlug, pullRequestId, userSlug, status, lastReviewedCommit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_addPullRequestReviewer",
  "Add a single reviewer to a pull request without replacing existing reviewers (unlike bitbucket_updatePullRequest, which replaces the whole reviewer list). Resolve userSlug via bitbucket_getUser if needed.",
  bitbucketToolSchemas.addPullRequestReviewer,
  async ({ projectKey, repositorySlug, pullRequestId, userSlug }) => {
    const result = await bitbucketService.addPullRequestReviewer(projectKey, repositorySlug, pullRequestId, userSlug);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_removePullRequestReviewer",
  "Remove a reviewer from a pull request. The user remains a participant but loses the REVIEWER role.",
  bitbucketToolSchemas.removePullRequestReviewer,
  async ({ projectKey, repositorySlug, pullRequestId, userSlug }) => {
    const result = await bitbucketService.removePullRequestReviewer(projectKey, repositorySlug, pullRequestId, userSlug);
    return formatToolResponse(result);
  }
);


server.tool(
  "bitbucket_canMergePullRequest",
  "Check whether a pull request can be merged. Returns canMerge, conflicted, and a list of vetoes (e.g. unresolved tasks, insufficient approvals, merge conflicts). Use this as a read-only guard before calling bitbucket_mergePullRequest.",
  bitbucketToolSchemas.canMergePullRequest,
  async ({ projectKey, repositorySlug, pullRequestId }) => {
    const result = await bitbucketService.canMergePullRequest(projectKey, repositorySlug, pullRequestId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_mergePullRequest",
  "Merge a pull request. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current 'version' (optimistic locking) — the call fails without it. Recommended: call bitbucket_canMergePullRequest first to ensure there are no merge vetoes. Optionally pass a custom merge message and a strategyId (must be enabled on the repository).",
  bitbucketToolSchemas.mergePullRequest,
  async ({ projectKey, repositorySlug, pullRequestId, version, message, strategyId, output }) => {
    const result = await bitbucketService.mergePullRequest(projectKey, repositorySlug, pullRequestId, version, message, strategyId, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_declinePullRequest",
  "Decline (reject) an open pull request without merging. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current 'version' (optimistic locking). Optionally pass a comment explaining the decision. A declined PR can later be reopened with bitbucket_reopenPullRequest.",
  bitbucketToolSchemas.declinePullRequest,
  async ({ projectKey, repositorySlug, pullRequestId, version, comment, output }) => {
    const result = await bitbucketService.declinePullRequest(projectKey, repositorySlug, pullRequestId, version, comment, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_reopenPullRequest",
  "Reopen a previously declined pull request. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current 'version' (optimistic locking). Only works on PRs in the DECLINED state.",
  bitbucketToolSchemas.reopenPullRequest,
  async ({ projectKey, repositorySlug, pullRequestId, version, output }) => {
    const result = await bitbucketService.reopenPullRequest(projectKey, repositorySlug, pullRequestId, version, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getPullRequestDiff",
  "Get text diff for a specific file in a Bitbucket pull request. Returns plain text diff format. Note: Before getting diff, use getPullRequestChanges to understand what files were changed in the PR",
  bitbucketToolSchemas.getPullRequestDiff,
  async ({ projectKey, repositorySlug, pullRequestId, path, contextLines, sinceId, srcPath, diffType, untilId, whitespace }) => {
    const result = await bitbucketService.getPullRequestDiff(projectKey, repositorySlug, pullRequestId, path, contextLines, sinceId, srcPath, diffType, untilId, whitespace);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createPullRequest",
  "Create a new pull request in a Bitbucket repository. IMPORTANT: Before creating a PR, use bitbucket_getRequiredReviewers to fetch required reviewers for the source and target branches to ensure the PR is not created without mandatory reviewers.",
  bitbucketToolSchemas.createPullRequest,
  async ({ projectKey, repositorySlug, title, description, fromRefId, toRefId, reviewers, draft, output }) => {
    const result = await bitbucketService.createPullRequest(projectKey, repositorySlug, title, description, fromRefId, toRefId, reviewers, draft, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_updatePullRequest",
  "Update the title, description, reviewers, destination branch or draft status of an existing pull request. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current 'version' number — this is required for optimistic locking and the call will fail without it. The reviewers parameter replaces ALL existing reviewers. If you want to preserve existing reviewers, include those from the current PR details along with any new ones you want to add.",
  bitbucketToolSchemas.updatePullRequest,
  async ({ projectKey, repositorySlug, pullRequestId, version, title, description, reviewers, draft, output }) => {
    const result = await bitbucketService.updatePullRequest(projectKey, repositorySlug, pullRequestId, version, title, description, reviewers, draft, output);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getRequiredReviewers",
  "Get required reviewers for pull request creation. Returns a set of users who are required reviewers for pull requests created from the given source repository and ref to the given target ref in this repository.",
  bitbucketToolSchemas.getRequiredReviewers,
  async ({ projectKey, repositorySlug, sourceRefId, targetRefId, sourceRepoId, targetRepoId }) => {
    const result = await bitbucketService.getRequiredReviewers(projectKey, repositorySlug, sourceRefId, targetRefId, sourceRepoId, targetRepoId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getInboxPullRequests",
  "Get pull requests from the authenticated user's inbox that need their review. Returns PRs across all repositories where the user is a reviewer.",
  bitbucketToolSchemas.getInboxPullRequests,
  async ({ start, limit }) => {
    const result = await bitbucketService.getInboxPullRequests(start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getDashboardPullRequests",
  "Get pull requests from the Bitbucket dashboard across all repositories. Useful for finding all PRs where you are the author, reviewer, or participant without specifying a project or repository.",
  bitbucketToolSchemas.getDashboardPullRequests,
  async ({ role, state, closedSince, order, start, limit }) => {
    const result = await bitbucketService.getDashboardPullRequests(role, state, closedSince, order, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getBranchRestrictions",
  "List the branch (ref) restrictions configured for a Bitbucket repository. Requires REPO_ADMIN. Optionally filter by matcher type/id and restriction type.",
  bitbucketToolSchemas.getBranchRestrictions,
  async ({ projectKey, repositorySlug, matcherType, matcherId, type, start, limit }) => {
    const result = await bitbucketService.getBranchRestrictions(projectKey, repositorySlug, matcherType, matcherId, type, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createRepository",
  "Create a new repository in a Bitbucket project. Requires REPO_CREATE permission on the project. SCM defaults to 'git'.",
  bitbucketToolSchemas.createRepository,
  async ({ projectKey, name, scmId, defaultBranch }) => {
    const result = await bitbucketService.createRepository(projectKey, name, scmId, defaultBranch);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createProject",
  "Create a new Bitbucket project. Requires PROJECT_CREATE permission. The key must be unique.",
  bitbucketToolSchemas.createProject,
  async ({ key, name, description }) => {
    const result = await bitbucketService.createProject(key, name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_updateRepository",
  "Update a Bitbucket repository: rename it, change its description or default branch, or move it to another project. Requires REPO_ADMIN permission. Only the provided fields are changed.",
  bitbucketToolSchemas.updateRepository,
  async ({ projectKey, repositorySlug, name, description, defaultBranch, targetProjectKey }) => {
    const result = await bitbucketService.updateRepository(projectKey, repositorySlug, name, description, defaultBranch, targetProjectKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deletePullRequestComment",
  "Delete a comment from a Bitbucket pull request. Requires the current comment 'version' for optimistic locking. A comment that has replies cannot be deleted.",
  bitbucketToolSchemas.deletePullRequestComment,
  async ({ projectKey, repositorySlug, pullRequestId, commentId, version }) => {
    const result = await bitbucketService.deletePullRequestComment(projectKey, repositorySlug, pullRequestId, commentId, version);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_forkRepository",
  "Fork an existing Bitbucket repository. Requires REPO_READ on the origin and PROJECT_ADMIN on the target project. Without a target project the fork goes to the user's personal project.",
  bitbucketToolSchemas.forkRepository,
  async ({ projectKey, repositorySlug, name, targetProjectKey, defaultBranch }) => {
    const result = await bitbucketService.forkRepository(projectKey, repositorySlug, name, targetProjectKey, defaultBranch);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_updateProject",
  "Update an existing Bitbucket project's name or description. Requires PROJECT_ADMIN permission. The project key is never changed. Only the provided fields are updated.",
  bitbucketToolSchemas.updateProject,
  async ({ key, name, description }) => {
    const result = await bitbucketService.updateProject(key, name, description);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createBranchRestriction",
  "Create a branch (ref) restriction (branch permission) on a Bitbucket repository. Requires REPO_ADMIN. The matcher is specified by type (ANY_REF/BRANCH/PATTERN/MODEL_CATEGORY/MODEL_BRANCH) and value; optionally exempt users, groups, or access keys.",
  bitbucketToolSchemas.createBranchRestriction,
  async ({ projectKey, repositorySlug, type, matcherType, matcherValue, matcherDisplayId, exemptUserSlugs, exemptGroupNames, exemptAccessKeyIds }) => {
    const result = await bitbucketService.createBranchRestriction(projectKey, repositorySlug, type, matcherType, matcherValue, matcherDisplayId, exemptUserSlugs, exemptGroupNames, exemptAccessKeyIds);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_applyPullRequestSuggestion",
  "Apply a code suggestion contained in a pull request comment directly to the source branch, creating a commit. Requires the current comment version and pull request version. Equivalent to the 'Apply suggestion' button in the Bitbucket UI.",
  bitbucketToolSchemas.applyPullRequestSuggestion,
  async ({ projectKey, repositorySlug, pullRequestId, commentId, commentVersion, pullRequestVersion, commitMessage, suggestionIndex }) => {
    const result = await bitbucketService.applyPullRequestSuggestion(projectKey, repositorySlug, pullRequestId, commentId, commentVersion, pullRequestVersion, commitMessage, suggestionIndex);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getDefaultReviewerConditions",
  "List the default reviewer conditions configured for a Bitbucket repository. Each condition maps a source/target ref matcher to a set of default reviewers and a required-approvals count.",
  bitbucketToolSchemas.getDefaultReviewerConditions,
  async ({ projectKey, repositorySlug }) => {
    const result = await bitbucketService.getDefaultReviewerConditions(projectKey, repositorySlug);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_watchPullRequest",
  "Start watching a pull request, subscribing the authenticated user to its notifications.",
  bitbucketToolSchemas.watchPullRequest,
  async ({ projectKey, repositorySlug, pullRequestId }) => {
    const result = await bitbucketService.watchPullRequest(projectKey, repositorySlug, pullRequestId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getRequiredBuildsMergeChecks",
  "List the required-builds merge checks configured for a Bitbucket repository. Each check requires green builds for the given build keys before a PR targeting the matched ref can be merged.",
  bitbucketToolSchemas.getRequiredBuildsMergeChecks,
  async ({ projectKey, repositorySlug, start, limit }) => {
    const result = await bitbucketService.getRequiredBuildsMergeChecks(projectKey, repositorySlug, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createRequiredBuildsMergeCheck",
  "Create a required-builds merge check on a Bitbucket repository. Requires REPO_ADMIN. Provide the build parent keys that must be green and a target ref matcher (type + value); optionally exempt source refs.",
  bitbucketToolSchemas.createRequiredBuildsMergeCheck,
  async ({ projectKey, repositorySlug, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId }) => {
    const result = await bitbucketService.createRequiredBuildsMergeCheck(projectKey, repositorySlug, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_updateRequiredBuildsMergeCheck",
  "Update a required-builds merge check on a Bitbucket repository. Requires REPO_ADMIN. This replaces the whole check, so provide the complete desired build keys and matcher.",
  bitbucketToolSchemas.updateRequiredBuildsMergeCheck,
  async ({ projectKey, repositorySlug, id, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId }) => {
    const result = await bitbucketService.updateRequiredBuildsMergeCheck(projectKey, repositorySlug, id, buildParentKeys, refMatcherType, refMatcherValue, refMatcherDisplayId, exemptRefMatcherType, exemptRefMatcherValue, exemptRefMatcherDisplayId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_createDefaultReviewerCondition",
  "Create a default reviewer condition on a Bitbucket repository. Matchers are specified by type (ANY_REF, BRANCH, PATTERN, MODEL_CATEGORY, MODEL_BRANCH) and value. Reviewers are given as numeric user IDs (resolve usernames via bitbucket_getUser).",
  bitbucketToolSchemas.createDefaultReviewerCondition,
  async ({ projectKey, repositorySlug, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId }) => {
    const result = await bitbucketService.createDefaultReviewerCondition(projectKey, repositorySlug, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getBranchRestriction",
  "Get a single branch (ref) restriction from a Bitbucket repository by its ID. Requires REPO_ADMIN.",
  bitbucketToolSchemas.getBranchRestriction,
  async ({ projectKey, repositorySlug, id }) => {
    const result = await bitbucketService.getBranchRestriction(projectKey, repositorySlug, id);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteBranchRestriction",
  "Delete a branch (ref) restriction from a Bitbucket repository by its ID. Requires REPO_ADMIN.",
  bitbucketToolSchemas.deleteBranchRestriction,
  async ({ projectKey, repositorySlug, id }) => {
    const result = await bitbucketService.deleteBranchRestriction(projectKey, repositorySlug, id);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_searchCode",
  "Search code across Bitbucket. The query supports search modifiers like 'project:<key>', 'repo:<key>/<slug>', and 'ext:<extension>' to scope or filter results (e.g. 'project:TEST authenticate', 'repo:TEST/demo ext:js TODO'). NOTE: the 'repo:' modifier requires the project key — 'repo:projectkey/repositoryslug', not a bare slug. Returns matching files with hit contexts (snippets).",
  bitbucketToolSchemas.searchCode,
  async ({ query, limit, secondaryLimit }) => {
    const result = await bitbucketService.searchCode(query, limit, secondaryLimit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_updateDefaultReviewerCondition",
  "Update a default reviewer condition on a Bitbucket repository. This replaces the whole condition, so provide the complete desired matchers and reviewer set.",
  bitbucketToolSchemas.updateDefaultReviewerCondition,
  async ({ projectKey, repositorySlug, id, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId }) => {
    const result = await bitbucketService.updateDefaultReviewerCondition(projectKey, repositorySlug, id, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteDefaultReviewerCondition",
  "Delete a default reviewer condition from a Bitbucket repository by its ID.",
  bitbucketToolSchemas.deleteDefaultReviewerCondition,
  async ({ projectKey, repositorySlug, id }) => {
    const result = await bitbucketService.deleteDefaultReviewerCondition(projectKey, repositorySlug, id);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteRequiredBuildsMergeCheck",
  "Delete a required-builds merge check from a Bitbucket repository by its ID. Requires REPO_ADMIN.",
  bitbucketToolSchemas.deleteRequiredBuildsMergeCheck,
  async ({ projectKey, repositorySlug, id }) => {
    const result = await bitbucketService.deleteRequiredBuildsMergeCheck(projectKey, repositorySlug, id);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_unwatchPullRequest",
  "Stop watching a pull request, unsubscribing the authenticated user from its notifications.",
  bitbucketToolSchemas.unwatchPullRequest,
  async ({ projectKey, repositorySlug, pullRequestId }) => {
    const result = await bitbucketService.unwatchPullRequest(projectKey, repositorySlug, pullRequestId);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteProject",
  "Delete a Bitbucket project. Requires PROJECT_ADMIN permission. The project must contain no repositories or the call fails with a conflict.",
  bitbucketToolSchemas.deleteProject,
  async ({ key }) => {
    const result = await bitbucketService.deleteProject(key);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_deleteRepository",
  "Schedule a Bitbucket repository for deletion. Requires REPO_ADMIN (or the configured delete policy) permission. This is irreversible — the repository and its contents are removed.",
  bitbucketToolSchemas.deleteRepository,
  async ({ projectKey, repositorySlug }) => {
    const result = await bitbucketService.deleteRepository(projectKey, repositorySlug);
    return formatToolResponse(result);
  }
);

await connectServer(server);
