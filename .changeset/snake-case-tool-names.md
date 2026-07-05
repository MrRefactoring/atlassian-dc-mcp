---
"jira-datacenter-mcp": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

**Breaking:** rename every MCP tool (and prompt) from `<product>_camelCase` to `<product>_snake_case` for readability, e.g. `bitbucket_getProjects` → `bitbucket_get_projects`, `jira_searchIssues` → `jira_search_issues`, `confluence_getContentChildrenByType` → `confluence_get_content_children_by_type`. Tool behavior, input schemas, and descriptions are unchanged, but any client, script, or config that calls a tool by name must update to the new snake_case name. Prompt guidance text that references tool names was updated accordingly. Resource identifiers (already kebab-case, e.g. `bitbucket-repository`) are unchanged.
