---
"jira-datacenter-mcp": minor
---

Add Jira instance metadata read tools: `jira_get_configuration` (which optional features — voting, watching, sub-tasks, time tracking, attachments, issue linking — are enabled, with the time-tracking configuration), `jira_get_status_categories` / `jira_get_status_category` (the To Do / In Progress / Done grouping behind statuses), and `jira_get_issue_picker_suggestions` (issue suggestions matching a query and/or JQL, e.g. for building a picker).
