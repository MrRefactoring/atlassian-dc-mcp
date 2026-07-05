---
"jira-datacenter-mcp": minor
---

Add Jira issue-navigator column tools: `jira_get_my_columns` / `jira_set_my_columns` / `jira_reset_my_columns` for a user's own columns (defaulting to the current user), and `jira_get_default_columns` / `jira_set_default_columns` for the system default columns. The set operations use the endpoints' repeated `columns` form-field encoding rather than JSON.
