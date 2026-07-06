# Change Log

## 0.3.0

### Minor Changes

- [#7](https://github.com/MrRefactoring/atlassian-dc-mcp/pull/7) [`61adb53`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/61adb53e367b61ec85af0dad69414e7febce6c79) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Confluence attachment CRUD tools: get/create/update/move/delete attachments with full lifecycle management (metadata, data, versioning).

- [`868ed80`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/868ed806d79067527f8f084eed3b3bd4786e5e58) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add a first-class named-profile concept for managing more than one instance of the same product. `setup --profile <name>` reads/writes a distinct home file (`<product>.<profile>.env`) and Keychain account (`<product>-<profile>-token`/`-password`) instead of the default unsuffixed ones; set `ATLASSIAN_DC_MCP_PROFILE=<name>` when launching the server to read that profile back. `process.env` and `ATLASSIAN_DC_MCP_CONFIG_FILE` are unaffected and still take priority, as before.

- [`8f44f96`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/8f44f96242c4b3aed9aed90879da2dd656597900) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add confluence_triggerSiteBackup, confluence_getBackupRestoreJob, confluence_findBackupRestoreJobs and confluence_getInstanceMetrics, wrapping the generated BackupAndRestoreService and InstanceMetricsService. Scope is deliberately limited to triggering a site backup and querying job/instance status; the generated client's restore, file-upload, job-cancellation and file-listing operations are not wrapped as they're out of scope for this niche admin surface.

- [`520ddfd`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/520ddfd23b6b696f138f30063f66c1df6bcf9115) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Basic auth (username/password) support to confluence-datacenter-mcp as an alternative to the API token, with Keychain-backed password storage on macOS.

- [`eaca104`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/eaca104c48f7ab571ef4b3cece2796d92d4c0ffd) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Confluence content blueprint (template) draft-publishing tools: publish a shared or legacy draft created from a blueprint into live content. The generated client has no separate template list/get/create endpoints; this wraps the only blueprint-related surface it exposes.

- [`e727bd6`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/e727bd683885325644d7119abe559ed36959c758) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add confluence_convertContentBody, wrapping ContentBodyService to convert a content body between representations (e.g. storage to view/export_view/styled_view/editor, or editor back to storage).

- [`085ce61`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/085ce6129926164562e7ed0120329e8e452f93b2) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add confluence_getClusterNodes, wrapping the generated ClusterInformationService to list the status of each node in a Confluence Data Center cluster.

- [#5](https://github.com/MrRefactoring/atlassian-dc-mcp/pull/5) [`1ed0c25`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/1ed0c25fbf33299ac1db89d7936d15334bd5d7f3) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Build out Confluence content-lifecycle and space coverage: the MCP server grows from 5 to 42 tools. New tools cover content delete/history, children & descendants, labels, properties, restrictions and watchers; attachment read/remove; space CRUD, content listing, archive/restore and space properties.

- [`bfa4e4b`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/bfa4e4bd7cceccc6cfb4fa5561ddb669dfa82563) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add confluence_getLongRunningTask and confluence_getLongRunningTasks, wrapping the generated LongTaskService to inspect the status of Confluence's asynchronous background tasks (e.g. space export, reindex progress).

- [`312f077`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/312f077ede9be6133170c5768c17509814effe71) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add confluence_getServerInfo, wrapping the generated ServerInformationService to report the application build/version running on the target Confluence Data Center instance.

- [`a69cac1`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/a69cac102d499d286c6ebdc6c8234411eb006bc8) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Confluence space permissions tools: get all/anonymous/group/user permissions on a space, set the full permission set for up to 40 subjects, and grant/revoke individual operations for the anonymous user, a group, or a user.

- [`23569ef`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/23569efc84dd21669a83c9c51ab5a4769f6e91d8) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Confluence users and groups tools, previously entirely unconnected: self-service user lookup/profile/password tools, group and group-membership read tools, and system-administrator user/group lifecycle tools (create/update/delete/enable/disable users, create/delete groups, list active users).

- [`980d84b`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/980d84b80e7e0e91c2742ad6aeaca47f913d1392) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Confluence webhook tools: find/create/get/update/delete webhooks, plus invocation history, statistics, and connectivity testing. All operations require administrator permission on the Confluence Data Center instance.

- [`0854b17`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/0854b17d0a9dea205509c74ffae313d0fa47c737) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add MCP resources and prompts, the two protocol capabilities that were previously unused (only tools were registered).

  Resources — entities addressable by URI instead of only via a tool call:

  - `jira://issue/{issueKey}`
  - `confluence://page/{pageId}`
  - `bitbucket://repo/{projectKey}/{repositorySlug}` and `bitbucket://pr/{projectKey}/{repositorySlug}/{pullRequestId}`

  Prompts — reusable templates for common workflows:

  - `jira_triageIssue` — triage an issue and recommend a priority/assignee/transition.
  - `confluence_buildCqlQuery` — turn a natural-language request into a CQL query.
  - `bitbucket_reviewPullRequest` — guide a structured PR review with anchored inline comments.

- [`756e60d`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/756e60da2a933e9bc89618c42ad9dd368568d0e6) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Automatically retry transient API failures (HTTP 429 and 5xx) with exponential backoff and jitter (up to 3 retries) before a tool call reports an error. 4xx client errors are never retried since they won't succeed on a retry.

- [`751b29c`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/751b29ca1db528ef941870a46db3c20216920896) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - **Breaking:** rename every MCP tool (and prompt) from `<product>_camelCase` to `<product>_snake_case` for readability, e.g. `bitbucket_getProjects` → `bitbucket_get_projects`, `jira_searchIssues` → `jira_search_issues`, `confluence_getContentChildrenByType` → `confluence_get_content_children_by_type`. Tool behavior, input schemas, and descriptions are unchanged, but any client, script, or config that calls a tool by name must update to the new snake_case name. Prompt guidance text that references tool names was updated accordingly. Resource identifiers (already kebab-case, e.g. `bitbucket-repository`) are unchanged.

- [`6c385c1`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/6c385c1bf42dda730e9cf5dd8e8090a5c9ad36d0) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add MCP Streamable HTTP transport support, replacing the previously dead, fully-commented-out SSE code. Setting `ATLASSIAN_DC_MCP_HTTP_PORT` to a positive integer starts the server on that port using Streamable HTTP (stateful, session-aware) instead of stdio, unblocking remote and multi-client deployments. Stdio remains the default when the env var is unset, so existing Claude Desktop configurations are unaffected.

- [`344d1b0`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/344d1b0cef3074c8e1786153936b5d0d1bbda61a) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add structured logging (`datacenter-mcp-core`'s new `logger`), replacing scattered `console.error` calls. Every log line is one JSON object written to stderr — stdout stays exclusively reserved for the MCP JSON-RPC protocol stream on stdio, so this is safe on every transport. Set `ATLASSIAN_DC_MCP_LOG_LEVEL` (`debug`/`info`/`warn`/`error`, default `info`) to control verbosity.

### Patch Changes

- [`59f822e`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/59f822e73dff60e621dafb566e30938430b4b282) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Move each package's CLI entry point into TypeScript: the hand-written `bin/run.js` dispatcher becomes `src/run.ts`, compiled to `dist/run.js` by the normal build. The `bin` field now points at `dist/run.js` and the published `files` no longer ship a separate `bin/` directory. No change to the `npx <product>-datacenter-mcp [setup]` command or its behavior.

- [`9126faa`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/9126faaf28d181f1d80d629682fd85a17830c939) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Make every `index.ts` a pure barrel (re-exports only). Each product's tool-registration/bootstrap entry moves from `src/index.ts` to `src/server.ts` (imported by the `run.ts` bin dispatcher and the start/dev/inspect scripts), and `src/index.ts` becomes a barrel over the service, config, and mappers. In core, the `createMcpServer`/`connectServer`/`formatToolResponse` runtime moves to `src/server.ts` and `index.ts` re-exports it, so the `datacenter-mcp-core` public API is unchanged. No change to the `npx <product>-datacenter-mcp [setup]` command or server behavior.

- [`d8e142b`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d8e142be08844e8da6ec9425a0f36f5c85ccc282) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add a `paginateAll` helper to the shared core package for auto-paginating naturally small, bounded startAt-paged endpoints (e.g. a project's versions, a page's labels) inside a service method, so future list tools can return one fully-assembled list instead of requiring the caller to hand-roll a startAt loop. Open-ended search endpoints (JQL/CQL, repository listings) are intentionally excluded from this pattern and remain single-page and agent-driven.

- [`15b2bb0`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/15b2bb07279ce5528516ffc514897888b85d8d0b) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Replace the deprecated `server.tool(name, description, schema, handler)` calls with the current `server.registerTool(name, { description, inputSchema }, handler)` MCP SDK API, matching the `registerResource`/`registerPrompt` style already in use. No change to tool names, schemas, or behavior.

- [`d220a9e`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d220a9ee0eff2e006f8b44d262d6a697b1a25884) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Improve npm discoverability: mention Claude/AI assistants in package descriptions and add search keywords (mcp-server, claude, claude-desktop, anthropic, ai, llm, and product-specific aliases like jira-server/confluence-server/bitbucket-server).

- [`53966c2`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/53966c23c46be233ffbc4a48242dd963b0d256b4) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Split each server's monolithic `server.ts` into per-resource/domain tool modules under `src/tools/`, each exporting a `register<Group>Tools(server, service)` function; `server.ts` is now a thin orchestrator (config, service, `createMcpServer`, register calls, `connectServer`). Resources and prompts move to `src/resources.ts` and `src/prompts.ts`, and the shared instance-type description constant to `src/constants.ts`. Tool registration order is regrouped but the full tool set and behavior are unchanged.

- Updated dependencies [[`7ac1a1f`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/7ac1a1fae2d1b9e3f19293f95bbe3ef67e51de1b), [`9126faa`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/9126faaf28d181f1d80d629682fd85a17830c939), [`d220a9e`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d220a9ee0eff2e006f8b44d262d6a697b1a25884)]:
  - datacenter-mcp-core@0.3.0

## 0.2.0

### Minor Changes

- [`582a094`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/582a094960ba6d74453aabefa4ed44522ac07351) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Allow the MCP servers to start and run without an API token, for Data Center instances that permit anonymous access. `*_API_TOKEN` is no longer required by config validation or the interactive `setup` CLI; when it's absent, requests are sent with no `Authorization` header instead of the previous placeholder-token workaround.

### Patch Changes

- Updated dependencies [[`582a094`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/582a094960ba6d74453aabefa4ed44522ac07351)]:
  - datacenter-mcp-core@0.2.0
