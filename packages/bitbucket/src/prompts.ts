import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerPrompts(server: McpServer) {
  server.registerPrompt(
    'bitbucket_reviewPullRequest',
    {
      title: 'Review a Bitbucket pull request',
      description: 'Guides a structured code review of a pull request in a Bitbucket Data Center edition instance: read the diff and existing comments, then produce a review with actionable, anchored comments.',
      argsSchema: {
        projectKey: z.string().describe('The project key, e.g. PROJ'),
        repositorySlug: z.string().describe('The repository slug'),
        pullRequestId: z.number().describe('The pull request ID'),
      },
    },
    ({ projectKey, repositorySlug, pullRequestId }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review pull request ${projectKey}/${repositorySlug}#${pullRequestId}.

  1. Call bitbucket_getPullRequest for its title, description, reviewers, and current state.
  2. Call bitbucket_getPullRequestDiff (or bitbucket_getPullRequestChanges) to read the actual code changes.
  3. Call bitbucket_getPR_CommentsAndAction to see what's already been discussed and approved, so you don't repeat it.
  4. Identify concrete issues: bugs, missing edge cases, security concerns, and unclear or overly complex code.
  5. For each issue, add an inline comment anchored to the specific file/line using bitbucket_postPullRequestComment — do not just describe issues in prose.
  6. Finish with a short overall summary comment and a recommendation: approve, request changes, or note blockers.`,
          },
        },
      ],
    }),
  );
}
