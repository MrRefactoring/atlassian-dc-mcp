---
"jira-datacenter-mcp": patch
"confluence-datacenter-mcp": patch
"bitbucket-datacenter-mcp": patch
---

Move each package's CLI entry point into TypeScript: the hand-written `bin/run.js` dispatcher becomes `src/run.ts`, compiled to `dist/run.js` by the normal build. The `bin` field now points at `dist/run.js` and the published `files` no longer ship a separate `bin/` directory. No change to the `npx <product>-datacenter-mcp [setup]` command or its behavior.
