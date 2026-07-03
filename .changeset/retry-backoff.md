---
"jira-datacenter-mcp": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

Automatically retry transient API failures (HTTP 429 and 5xx) with exponential backoff and jitter (up to 3 retries) before a tool call reports an error. 4xx client errors are never retried since they won't succeed on a retry.
