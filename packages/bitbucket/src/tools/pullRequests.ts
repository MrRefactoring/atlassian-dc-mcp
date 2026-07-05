import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import type { BitbucketService } from '../bitbucketService.js';
import { bitbucketToolSchemas } from '../bitbucketService.js';

export function registerPullRequestTools(server: McpServer, service: BitbucketService) {
  server.tool(
    'bitbucket_getPullRequests',
    'Get pull requests for a Bitbucket repository',
    bitbucketToolSchemas.getPullRequests,
    async ({ projectKey, repositorySlug, withAttributes, at, withProperties, draft, filterText, state, order, direction, start, limit }) => {
      const result = await service.getPullRequests(projectKey, repositorySlug, withAttributes, at, withProperties, draft, filterText, state, order, direction, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getPullRequest',
    'Get a specific pull request by ID. Returns full details including title, description, reviewers, participants, author, source/target branches, current state, and version (needed for bitbucket_updatePullRequest).',
    bitbucketToolSchemas.getPullRequest,
    async ({ projectKey, repositorySlug, pullRequestId }) => {
      const result = await service.getPullRequest(projectKey, repositorySlug, pullRequestId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getPR_CommentsAndAction',
    'Get comments for a Bitbucket pull request and other actions, like approvals',
    bitbucketToolSchemas.getPullRequestComments,
    async ({ projectKey, repositorySlug, pullRequestId, start, limit, output }) => {
      const result = await service.getPullRequestCommentsAndActions(projectKey, repositorySlug, pullRequestId, start, limit, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getPullRequestChanges',
    'Get the changes for a Bitbucket pull request',
    bitbucketToolSchemas.getPullRequestChanges,
    async ({ projectKey, repositorySlug, pullRequestId, sinceId, changeScope, untilId, withComments, start, limit, output }) => {
      const result = await service.getPullRequestChanges(projectKey, repositorySlug, pullRequestId, sinceId, changeScope, untilId, withComments, start, limit, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getUser',
    'Get a Bitbucket user by their slug, or search for users by name/email to discover their slug. Use this to resolve userSlug for bitbucket_submitPullRequestReview when it is not already known from a comment response or PR participant list.',
    bitbucketToolSchemas.getUser,
    async ({ userSlug, filter }) => {
      const result = await service.getUser(userSlug, filter);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_postPullRequestComment',
    'Post a comment to a Bitbucket pull request. Use pending: true to create a draft comment that is only visible to you until you call bitbucket_submitPullRequestReview. NOTE: pending only works when filePath is provided (file-level or inline comments). True top-level PR comments (no filePath) are always posted live and cannot be drafted. Use severity: \'BLOCKER\' to post the comment as a task — tasks must be resolved before the PR can be merged.',
    bitbucketToolSchemas.postPullRequestComment,
    async ({ projectKey, repositorySlug, pullRequestId, text, parentId, filePath, startLine, startLineType, line, lineType, pending, severity, output }) => {
      const result = await service.postPullRequestComment(projectKey, repositorySlug, pullRequestId, text, parentId, filePath, startLine, startLineType, line, lineType, pending, severity, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_updatePullRequestComment',
    'Update an existing pull request comment. Use to edit text, change severity, or resolve/reopen it via state. On a regular comment, state: \'RESOLVED\' resolves the comment thread (the \'Resolve\' button in the UI) and \'OPEN\' reopens it. On a BLOCKER (task) comment, \'RESOLVED\' also ticks the task and \'OPEN\' un-ticks it. Resolution is driven by the root comment\'s state. Requires the current \'version\' from optimistic locking; fetch it via bitbucket_getPR_CommentsAndAction or use the version returned when the comment was created.',
    bitbucketToolSchemas.updatePullRequestComment,
    async ({ projectKey, repositorySlug, pullRequestId, commentId, version, text, state, severity, output }) => {
      const result = await service.updatePullRequestComment(projectKey, repositorySlug, pullRequestId, commentId, version, text, state, severity, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_submitPullRequestReview',
    'Submit a pull request review, publishing all pending (draft) comments and setting the reviewer\'s verdict. This is equivalent to clicking \'Submit Review\' in the Bitbucket UI. Use after posting comments with pending: true. To resolve userSlug: (1) check author.slug in any comment you posted this session, (2) check the reviewers/participants array from bitbucket_getPullRequest, or (3) call bitbucket_getUser with a name/email filter as a last resort.',
    bitbucketToolSchemas.submitPullRequestReview,
    async ({ projectKey, repositorySlug, pullRequestId, userSlug, status, lastReviewedCommit }) => {
      const result = await service.submitPullRequestReview(projectKey, repositorySlug, pullRequestId, userSlug, status, lastReviewedCommit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_addPullRequestReviewer',
    'Add a single reviewer to a pull request without replacing existing reviewers (unlike bitbucket_updatePullRequest, which replaces the whole reviewer list). Resolve userSlug via bitbucket_getUser if needed.',
    bitbucketToolSchemas.addPullRequestReviewer,
    async ({ projectKey, repositorySlug, pullRequestId, userSlug }) => {
      const result = await service.addPullRequestReviewer(projectKey, repositorySlug, pullRequestId, userSlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_removePullRequestReviewer',
    'Remove a reviewer from a pull request. The user remains a participant but loses the REVIEWER role.',
    bitbucketToolSchemas.removePullRequestReviewer,
    async ({ projectKey, repositorySlug, pullRequestId, userSlug }) => {
      const result = await service.removePullRequestReviewer(projectKey, repositorySlug, pullRequestId, userSlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getPullRequestParticipants',
    'List the participants of a pull request — everyone who has interacted with it (author, reviewers, and anyone else who has commented or approved), unlike bitbucket_getRequiredReviewers which only covers reviewers requested up front.',
    bitbucketToolSchemas.getPullRequestParticipants,
    async ({ projectKey, repositorySlug, pullRequestId, start, limit }) => {
      const result = await service.getPullRequestParticipants(projectKey, repositorySlug, pullRequestId, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_canMergePullRequest',
    'Check whether a pull request can be merged. Returns canMerge, conflicted, and a list of vetoes (e.g. unresolved tasks, insufficient approvals, merge conflicts). Use this as a read-only guard before calling bitbucket_mergePullRequest.',
    bitbucketToolSchemas.canMergePullRequest,
    async ({ projectKey, repositorySlug, pullRequestId }) => {
      const result = await service.canMergePullRequest(projectKey, repositorySlug, pullRequestId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_mergePullRequest',
    'Merge a pull request. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current \'version\' (optimistic locking) — the call fails without it. Recommended: call bitbucket_canMergePullRequest first to ensure there are no merge vetoes. Optionally pass a custom merge message and a strategyId (must be enabled on the repository).',
    bitbucketToolSchemas.mergePullRequest,
    async ({ projectKey, repositorySlug, pullRequestId, version, message, strategyId, output }) => {
      const result = await service.mergePullRequest(projectKey, repositorySlug, pullRequestId, version, message, strategyId, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_declinePullRequest',
    'Decline (reject) an open pull request without merging. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current \'version\' (optimistic locking). Optionally pass a comment explaining the decision. A declined PR can later be reopened with bitbucket_reopenPullRequest.',
    bitbucketToolSchemas.declinePullRequest,
    async ({ projectKey, repositorySlug, pullRequestId, version, comment, output }) => {
      const result = await service.declinePullRequest(projectKey, repositorySlug, pullRequestId, version, comment, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_reopenPullRequest',
    'Reopen a previously declined pull request. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current \'version\' (optimistic locking). Only works on PRs in the DECLINED state.',
    bitbucketToolSchemas.reopenPullRequest,
    async ({ projectKey, repositorySlug, pullRequestId, version, output }) => {
      const result = await service.reopenPullRequest(projectKey, repositorySlug, pullRequestId, version, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getPullRequestDiff',
    'Get text diff for a specific file in a Bitbucket pull request. Returns plain text diff format. Note: Before getting diff, use getPullRequestChanges to understand what files were changed in the PR',
    bitbucketToolSchemas.getPullRequestDiff,
    async ({ projectKey, repositorySlug, pullRequestId, path, contextLines, sinceId, srcPath, diffType, untilId, whitespace }) => {
      const result = await service.getPullRequestDiff(projectKey, repositorySlug, pullRequestId, path, contextLines, sinceId, srcPath, diffType, untilId, whitespace);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createPullRequest',
    'Create a new pull request in a Bitbucket repository. IMPORTANT: Before creating a PR, use bitbucket_getRequiredReviewers to fetch required reviewers for the source and target branches to ensure the PR is not created without mandatory reviewers.',
    bitbucketToolSchemas.createPullRequest,
    async ({ projectKey, repositorySlug, title, description, fromRefId, toRefId, reviewers, draft, output }) => {
      const result = await service.createPullRequest(projectKey, repositorySlug, title, description, fromRefId, toRefId, reviewers, draft, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_updatePullRequest',
    'Update the title, description, reviewers, destination branch or draft status of an existing pull request. IMPORTANT: You MUST first call bitbucket_getPullRequest to get the current \'version\' number — this is required for optimistic locking and the call will fail without it. The reviewers parameter replaces ALL existing reviewers. If you want to preserve existing reviewers, include those from the current PR details along with any new ones you want to add.',
    bitbucketToolSchemas.updatePullRequest,
    async ({ projectKey, repositorySlug, pullRequestId, version, title, description, reviewers, draft, output }) => {
      const result = await service.updatePullRequest(projectKey, repositorySlug, pullRequestId, version, title, description, reviewers, draft, output);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getRequiredReviewers',
    'Get required reviewers for pull request creation. Returns a set of users who are required reviewers for pull requests created from the given source repository and ref to the given target ref in this repository.',
    bitbucketToolSchemas.getRequiredReviewers,
    async ({ projectKey, repositorySlug, sourceRefId, targetRefId, sourceRepoId, targetRepoId }) => {
      const result = await service.getRequiredReviewers(projectKey, repositorySlug, sourceRefId, targetRefId, sourceRepoId, targetRepoId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getInboxPullRequests',
    'Get pull requests from the authenticated user\'s inbox that need their review. Returns PRs across all repositories where the user is a reviewer.',
    bitbucketToolSchemas.getInboxPullRequests,
    async ({ start, limit }) => {
      const result = await service.getInboxPullRequests(start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getDashboardPullRequests',
    'Get pull requests from the Bitbucket dashboard across all repositories. Useful for finding all PRs where you are the author, reviewer, or participant without specifying a project or repository.',
    bitbucketToolSchemas.getDashboardPullRequests,
    async ({ role, state, closedSince, order, start, limit }) => {
      const result = await service.getDashboardPullRequests(role, state, closedSince, order, start, limit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deletePullRequestComment',
    'Delete a comment from a Bitbucket pull request. Requires the current comment \'version\' for optimistic locking. A comment that has replies cannot be deleted.',
    bitbucketToolSchemas.deletePullRequestComment,
    async ({ projectKey, repositorySlug, pullRequestId, commentId, version }) => {
      const result = await service.deletePullRequestComment(projectKey, repositorySlug, pullRequestId, commentId, version);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_applyPullRequestSuggestion',
    'Apply a code suggestion contained in a pull request comment directly to the source branch, creating a commit. Requires the current comment version and pull request version. Equivalent to the \'Apply suggestion\' button in the Bitbucket UI.',
    bitbucketToolSchemas.applyPullRequestSuggestion,
    async ({ projectKey, repositorySlug, pullRequestId, commentId, commentVersion, pullRequestVersion, commitMessage, suggestionIndex }) => {
      const result = await service.applyPullRequestSuggestion(projectKey, repositorySlug, pullRequestId, commentId, commentVersion, pullRequestVersion, commitMessage, suggestionIndex);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_getDefaultReviewerConditions',
    'List the default reviewer conditions configured for a Bitbucket repository. Each condition maps a source/target ref matcher to a set of default reviewers and a required-approvals count.',
    bitbucketToolSchemas.getDefaultReviewerConditions,
    async ({ projectKey, repositorySlug }) => {
      const result = await service.getDefaultReviewerConditions(projectKey, repositorySlug);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_watchPullRequest',
    'Start watching a pull request, subscribing the authenticated user to its notifications.',
    bitbucketToolSchemas.watchPullRequest,
    async ({ projectKey, repositorySlug, pullRequestId }) => {
      const result = await service.watchPullRequest(projectKey, repositorySlug, pullRequestId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_createDefaultReviewerCondition',
    'Create a default reviewer condition on a Bitbucket repository. Matchers are specified by type (ANY_REF, BRANCH, PATTERN, MODEL_CATEGORY, MODEL_BRANCH) and value. Reviewers are given as numeric user IDs (resolve usernames via bitbucket_getUser).',
    bitbucketToolSchemas.createDefaultReviewerCondition,
    async ({ projectKey, repositorySlug, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId }) => {
      const result = await service.createDefaultReviewerCondition(projectKey, repositorySlug, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_updateDefaultReviewerCondition',
    'Update a default reviewer condition on a Bitbucket repository. This replaces the whole condition, so provide the complete desired matchers and reviewer set.',
    bitbucketToolSchemas.updateDefaultReviewerCondition,
    async ({ projectKey, repositorySlug, id, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId }) => {
      const result = await service.updateDefaultReviewerCondition(projectKey, repositorySlug, id, sourceMatcherType, sourceMatcherValue, targetMatcherType, targetMatcherValue, reviewerIds, requiredApprovals, sourceMatcherDisplayId, targetMatcherDisplayId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_deleteDefaultReviewerCondition',
    'Delete a default reviewer condition from a Bitbucket repository by its ID.',
    bitbucketToolSchemas.deleteDefaultReviewerCondition,
    async ({ projectKey, repositorySlug, id }) => {
      const result = await service.deleteDefaultReviewerCondition(projectKey, repositorySlug, id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'bitbucket_unwatchPullRequest',
    'Stop watching a pull request, unsubscribing the authenticated user from its notifications.',
    bitbucketToolSchemas.unwatchPullRequest,
    async ({ projectKey, repositorySlug, pullRequestId }) => {
      const result = await service.unwatchPullRequest(projectKey, repositorySlug, pullRequestId);

      return formatToolResponse(result);
    },
  );
}
