---
"datacenter-mcp-core": patch
"jira-datacenter-mcp": patch
"confluence-datacenter-mcp": patch
"bitbucket-datacenter-mcp": patch
---

Make every `index.ts` a pure barrel (re-exports only). Each product's tool-registration/bootstrap entry moves from `src/index.ts` to `src/server.ts` (imported by the `run.ts` bin dispatcher and the start/dev/inspect scripts), and `src/index.ts` becomes a barrel over the service, config, and mappers. In core, the `createMcpServer`/`connectServer`/`formatToolResponse` runtime moves to `src/server.ts` and `index.ts` re-exports it, so the `datacenter-mcp-core` public API is unchanged. No change to the `npx <product>-datacenter-mcp [setup]` command or server behavior.
