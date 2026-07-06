---
"datacenter-mcp-core": minor
---

Add a configurable response-size cap so oversized API responses no longer blow the model's context window. Every tool response is serialized through `formatToolResponse`, which now truncates payloads larger than `ATLASSIAN_DC_MCP_MAX_RESPONSE_CHARS` (default 100,000 characters, ~25k tokens) and appends a clear marker explaining the payload was cut and how to get the rest (narrow the query, use a smaller limit or pagination, request specific fields). Set the env var to `0` to disable the cap. This protects Jira, Confluence, and Bitbucket uniformly against large diffs, long page bodies, and big unfiltered list results.
