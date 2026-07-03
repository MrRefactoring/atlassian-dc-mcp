---
"jira-datacenter-mcp": patch
"confluence-datacenter-mcp": patch
"bitbucket-datacenter-mcp": patch
---

Add a `paginateAll` helper to the shared core package for auto-paginating naturally small, bounded startAt-paged endpoints (e.g. a project's versions, a page's labels) inside a service method, so future list tools can return one fully-assembled list instead of requiring the caller to hand-roll a startAt loop. Open-ended search endpoints (JQL/CQL, repository listings) are intentionally excluded from this pattern and remain single-page and agent-driven.
