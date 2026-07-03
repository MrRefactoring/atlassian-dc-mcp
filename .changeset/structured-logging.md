---
"jira-datacenter-mcp": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

Add structured logging (`datacenter-mcp-core`'s new `logger`), replacing scattered `console.error` calls. Every log line is one JSON object written to stderr — stdout stays exclusively reserved for the MCP JSON-RPC protocol stream on stdio, so this is safe on every transport. Set `ATLASSIAN_DC_MCP_LOG_LEVEL` (`debug`/`info`/`warn`/`error`, default `info`) to control verbosity.
