import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { jiraInstanceType } from './constants.js';

export function registerPrompts(server: McpServer) {
  server.registerPrompt(
    'jira_triageIssue',
    {
      title: 'Triage a Jira issue',
      description: `Guides triaging a single issue in the ${jiraInstanceType}: gather its details, comments, and available transitions, then recommend a priority, assignee, and next status.`,
      argsSchema: {
        issueKey: z.string().describe('The issue key to triage, e.g. PROJ-123'),
      },
    },
    ({ issueKey }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Triage Jira issue ${issueKey}.

  1. Call jira_getIssue for ${issueKey} to read its summary, description, status, priority, and assignee.
  2. Call jira_getIssueComments for ${issueKey} to check for prior discussion or blockers.
  3. Call jira_getTransitions for ${issueKey} to see what statuses it can move to next.
  4. Summarize what the issue is about, its current state, and anything blocking it.
  5. Recommend a priority (with reasoning), whether it needs reassignment, and which transition (if any) it should move to next.

  This is a read-only triage — do not call jira_transitionIssue, jira_updateIssue, or jira_assignIssue until the recommendation has been confirmed.`,
          },
        },
      ],
    }),
  );
}
