---
"jira-datacenter-mcp": patch
"confluence-datacenter-mcp": patch
"bitbucket-datacenter-mcp": patch
---

Replace the deprecated `server.tool(name, description, schema, handler)` calls with the current `server.registerTool(name, { description, inputSchema }, handler)` MCP SDK API, matching the `registerResource`/`registerPrompt` style already in use. No change to tool names, schemas, or behavior.
