import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import { createBitbucketCompleters } from './completions.js';
import type { BitbucketService } from './bitbucketService.js';

function userPrompt(text: string) {
  return {
    messages: [
      {
        role: 'user' as const,
        content: { type: 'text' as const, text },
      },
    ],
  };
}

export function registerPrompts(server: McpServer, service: BitbucketService) {
  const completers = createBitbucketCompleters(service);

  server.registerPrompt(
    'bitbucket_review_pull_request',
    {
      title: 'Review a Bitbucket pull request',
      description: 'Guides a structured code review of a pull request in a Bitbucket Data Center edition instance: read the diff and existing comments, then produce a review with actionable, anchored comments.',
      argsSchema: {
        projectKey: completable(z.string().describe('The project key, e.g. PROJ'), completers.projectKey),
        repositorySlug: completable(z.string().describe('The repository slug'), completers.repositorySlug),
        pullRequestId: z.number().describe('The pull request ID'),
      },
    },
    ({ projectKey, repositorySlug, pullRequestId }) => userPrompt(`Review pull request ${projectKey}/${repositorySlug}#${pullRequestId}.

  1. Call bitbucket_get_pull_request for its title, description, reviewers, and current state.
  2. Call bitbucket_get_pull_request_diff (or bitbucket_get_pull_request_changes) to read the actual code changes.
  3. Call bitbucket_get_pr_comments_and_action to see what's already been discussed and approved, so you don't repeat it.
  4. Identify concrete issues: bugs, missing edge cases, security concerns, and unclear or overly complex code.
  5. For each issue, add an inline comment anchored to the specific file/line using bitbucket_post_pull_request_comment — do not just describe issues in prose.
  6. Finish with a short overall summary comment and a recommendation: approve, request changes, or note blockers.`),
  );

  server.registerPrompt(
    'bitbucket_triage_open_pull_requests',
    {
      title: 'Triage open pull requests',
      description: 'Reviews the open pull requests in a Bitbucket Data Center edition repository and proposes a review order based on age, size, reviewer coverage, and readiness.',
      argsSchema: {
        projectKey: completable(z.string().describe('The project key, e.g. PROJ'), completers.projectKey),
        repositorySlug: completable(z.string().describe('The repository slug'), completers.repositorySlug),
      },
    },
    ({ projectKey, repositorySlug }) => userPrompt(`Triage the open pull requests in ${projectKey}/${repositorySlug}.

  1. Call bitbucket_get_pull_requests (state OPEN) to list the open PRs.
  2. For each PR, note its age, author, reviewers and their approval state, and whether it is a draft.
  3. Flag PRs that are stale (no recent activity), lack reviewers, or are blocked (declined tasks, failing checks).
  4. Propose a review order — highest-value / most-blocked first — with a one-line reason per PR.

  This is triage only — do not approve, decline, or merge any pull request; just recommend what to look at first.`),
  );

  server.registerPrompt(
    'bitbucket_investigate_merge_readiness',
    {
      title: 'Investigate why a PR cannot merge',
      description: 'Diagnoses what is blocking a Bitbucket Data Center edition pull request from merging: unresolved tasks, missing approvals, failing builds, or merge conflicts.',
      argsSchema: {
        projectKey: completable(z.string().describe('The project key, e.g. PROJ'), completers.projectKey),
        repositorySlug: completable(z.string().describe('The repository slug'), completers.repositorySlug),
        pullRequestId: z.number().describe('The pull request ID'),
      },
    },
    ({ projectKey, repositorySlug, pullRequestId }) => userPrompt(`Explain why pull request ${projectKey}/${repositorySlug}#${pullRequestId} cannot be merged yet.

  1. Call bitbucket_can_merge_pull_request to get the mergeability verdict and any vetoes.
  2. Call bitbucket_get_pull_request_blocker_comments to list unresolved tasks that block the merge.
  3. Call bitbucket_get_pull_request for reviewer approval state, and bitbucket_get_build_status on its latest commit for CI results.
  4. Summarize each blocker (conflicts, missing approvals, unresolved tasks, failing builds) and what action would clear it.

  This is read-only diagnosis — do not merge, override, or resolve anything.`),
  );

  server.registerPrompt(
    'bitbucket_prepare_pull_request',
    {
      title: 'Prepare a pull request from a branch',
      description: 'Summarizes the changes between two refs in a Bitbucket Data Center edition repository and drafts a pull request title and description.',
      argsSchema: {
        projectKey: completable(z.string().describe('The project key, e.g. PROJ'), completers.projectKey),
        repositorySlug: completable(z.string().describe('The repository slug'), completers.repositorySlug),
        from: z.string().describe('The source ref/branch to merge from, e.g. feature/my-change'),
        to: z.string().describe('The target ref/branch to merge into, e.g. master'),
      },
    },
    ({ projectKey, repositorySlug, from, to }) => userPrompt(`Draft a pull request for merging ${from} into ${to} in ${projectKey}/${repositorySlug}.

  1. Call bitbucket_compare_refs (compareType 'commits') to read the commits that ${from} adds over ${to}.
  2. Call bitbucket_get_compare_diff for ${from}..${to} to understand the actual code changes.
  3. Group the changes into themes and identify the primary intent of the branch.
  4. Draft a concise PR title and a structured description (summary, notable changes, testing notes, any risks).

  This is drafting only — do not create the pull request until the title and description have been confirmed.`),
  );
}
