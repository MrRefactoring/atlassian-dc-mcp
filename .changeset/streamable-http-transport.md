---
"jira-datacenter-mcp": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

Add MCP Streamable HTTP transport support, replacing the previously dead, fully-commented-out SSE code. Setting `ATLASSIAN_DC_MCP_HTTP_PORT` to a positive integer starts the server on that port using Streamable HTTP (stateful, session-aware) instead of stdio, unblocking remote and multi-client deployments. Stdio remains the default when the env var is unset, so existing Claude Desktop configurations are unaffected.
