---
"jira-datacenter-mcp": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

Add MCP resources and prompts, the two protocol capabilities that were previously unused (only tools were registered).

Resources — entities addressable by URI instead of only via a tool call:
- `jira://issue/{issueKey}`
- `confluence://page/{pageId}`
- `bitbucket://repo/{projectKey}/{repositorySlug}` and `bitbucket://pr/{projectKey}/{repositorySlug}/{pullRequestId}`

Prompts — reusable templates for common workflows:
- `jira_triageIssue` — triage an issue and recommend a priority/assignee/transition.
- `confluence_buildCqlQuery` — turn a natural-language request into a CQL query.
- `bitbucket_reviewPullRequest` — guide a structured PR review with anchored inline comments.
