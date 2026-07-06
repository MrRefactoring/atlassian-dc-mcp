import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import { jiraInstanceType } from './constants.js';
import { createJiraCompleters } from './completions.js';
import type { JiraService } from './jiraService.js';

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

export function registerPrompts(server: McpServer, service: JiraService) {
  const completers = createJiraCompleters(service);

  server.registerPrompt(
    'jira_triage_issue',
    {
      title: 'Triage a Jira issue',
      description: `Guides triaging a single issue in the ${jiraInstanceType}: gather its details, comments, and available transitions, then recommend a priority, assignee, and next status.`,
      argsSchema: {
        issueKey: z.string().describe('The issue key to triage, e.g. PROJ-123'),
      },
    },
    ({ issueKey }) => userPrompt(`Triage Jira issue ${issueKey}.

  1. Call jira_get_issue for ${issueKey} to read its summary, description, status, priority, and assignee.
  2. Call jira_get_issue_comments for ${issueKey} to check for prior discussion or blockers.
  3. Call jira_get_transitions for ${issueKey} to see what statuses it can move to next.
  4. Summarize what the issue is about, its current state, and anything blocking it.
  5. Recommend a priority (with reasoning), whether it needs reassignment, and which transition (if any) it should move to next.

  This is a read-only triage — do not call jira_transition_issue, jira_update_issue, or jira_assign_issue until the recommendation has been confirmed.`),
  );

  server.registerPrompt(
    'jira_plan_sprint',
    {
      title: 'Plan a sprint from a board',
      description: `Reviews an agile board's backlog and active sprint in the ${jiraInstanceType} and proposes which issues to pull into the sprint, based on priority, estimates, and readiness.`,
      argsSchema: {
        boardId: completable(z.string().describe('The numeric board id, e.g. 42'), completers.boardId),
        capacity: z
          .string()
          .optional()
          .describe('Optional team capacity for the sprint, e.g. "20 story points" or "5 issues"'),
      },
    },
    ({ boardId, capacity }) => userPrompt(`Help plan the next sprint for board ${boardId}${capacity ? ` (team capacity: ${capacity})` : ''}.

  1. Call jira_get_board_sprints for board ${boardId} to find the active/future sprint to plan into.
  2. Call jira_get_board_backlog_issues for board ${boardId} to see the candidate backlog.
  3. For the target sprint, call jira_get_sprint_issues to see what is already committed.
  4. Assess each backlog candidate for priority, estimate, and readiness (description, acceptance criteria, no blocking dependencies).
  5. Propose an ordered list of issues to pull into the sprint that fits the stated capacity${capacity ? '' : ' (ask for the team capacity if it matters)'}, and flag anything under-specified.

  This is planning only — do not call jira_move_issues_to_sprint until the proposed sprint contents have been confirmed.`),
  );

  server.registerPrompt(
    'jira_break_down_epic',
    {
      title: 'Break down an epic into stories',
      description: `Reviews an epic in the ${jiraInstanceType}, summarizes its existing child issues, and proposes the additional stories/tasks needed to complete it.`,
      argsSchema: {
        epicKey: z.string().describe('The epic issue key, e.g. PROJ-100'),
      },
    },
    ({ epicKey }) => userPrompt(`Break down epic ${epicKey} into deliverable work.

  1. Call jira_get_epic for ${epicKey} (or jira_get_issue if it is not an agile epic) to read its goal and scope.
  2. Call jira_get_epic_issues for ${epicKey} to list the child issues that already exist.
  3. Identify gaps between the epic's stated goal and its current child issues.
  4. Propose a set of new stories/tasks (each with a title and a one-line description) that would close those gaps, grouped logically.

  This is planning only — do not call jira_create_issue or jira_move_issues_to_epic until the proposed breakdown has been confirmed.`),
  );

  server.registerPrompt(
    'jira_build_jql',
    {
      title: 'Build and validate a JQL query',
      description: `Turns a natural-language question into a JQL query for the ${jiraInstanceType}, using the instance's real fields and values, then validates it against a live search.`,
      argsSchema: {
        goal: z
          .string()
          .describe('What you want to find, in plain language, e.g. "open bugs assigned to me due this week"'),
      },
    },
    ({ goal }) => userPrompt(`Build a JQL query for this request: ${goal}

  1. Call jira_get_jql_autocomplete_data to discover the fields, operators, and reserved words this instance actually supports.
  2. If the request references a specific field's values (a project, status, component, custom field, etc.), use jira_get_jql_field_autocomplete to confirm the exact value strings.
  3. Draft a JQL query that expresses the request precisely, preferring stable identifiers over display names.
  4. Validate it by calling jira_search_issues with the draft JQL and maxResults 1 — confirm it parses and returns plausible results.
  5. Return the final JQL, a plain-language explanation of each clause, and note any assumptions you had to make.`),
  );
}
