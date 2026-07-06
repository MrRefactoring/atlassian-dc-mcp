---
"datacenter-mcp-core": minor
"jira-datacenter-mcp": minor
---

Mature the Jira MCP surface:

- **Tool annotations** on all Jira tools. A new `deriveToolAnnotations` / `registerAnnotatedTool` helper in core derives `readOnlyHint`/`destructiveHint`/`idempotentHint`/`title`/`openWorldHint` from each tool's `<product>_<verb>_<noun>` name, so hosts can auto-approve read-only calls and warn before destructive ones (delete/remove/merge-version).
- **More resources**: added `jira://project/{key}`, `jira://board/{id}`, and `jira://user/{username}` alongside the existing `jira://issue/{key}`.
- **More prompts**: added `jira_plan_sprint`, `jira_break_down_epic`, and `jira_build_jql` alongside `jira_triage_issue`.
- **Opt-in pagination**: the bounded agile listers (`jira_get_boards`, `jira_get_board_sprints`, `jira_get_board_versions`, `jira_get_board_epics`) accept `fetchAll` to follow pagination and return every page as a flat array (safety-capped). The JQL-backed issue listings stay single-page and agent-driven.
