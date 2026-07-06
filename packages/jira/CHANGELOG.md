# Change Log

## 0.3.0

### Minor Changes

- [`868ed80`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/868ed806d79067527f8f084eed3b3bd4786e5e58) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add a first-class named-profile concept for managing more than one instance of the same product. `setup --profile <name>` reads/writes a distinct home file (`<product>.<profile>.env`) and Keychain account (`<product>-<profile>-token`/`-password`) instead of the default unsuffixed ones; set `ATLASSIAN_DC_MCP_PROFILE=<name>` when launching the server to read that profile back. `process.env` and `ATLASSIAN_DC_MCP_CONFIG_FILE` are unaffected and still take priority, as before.

- [`5b39442`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/5b394420ffc8588313b647f51292015666d9b55f) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira application properties tools: jira_getApplicationProperty, jira_getAdvancedSettings, and jira_setApplicationProperty for reading and updating global application properties / advanced settings. The set operation calls the endpoint directly since the generated client's `setPropertyViaRestfulTable` omits the request body the REST API requires.

- [`c6046bf`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/c6046bf0ba10f0a67ba3ed399fc1b2b1b031efe9) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add jira_getAttachmentContent to download an attachment's raw content as base64, fixing the previous metadata-only round trip.

- [`520ddfd`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/520ddfd23b6b696f138f30063f66c1df6bcf9115) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Basic auth (username/password) support to jira-datacenter-mcp as an alternative to the API token, with Keychain-backed password storage on macOS.

- [`41096e8`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/41096e8b2107755e948250b49620b901f1c5c6f3) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira Data Center cluster, index snapshot, and reindex admin tools (20 new tools): cluster node listing/deletion/offline/index-snapshot-request plus zero-downtime upgrade approve/cancel/retry/start/state from ClusterService; issue index summary from IndexService; index snapshot list/create/status from IndexSnapshotService; and reindex info/start/per-issue/progress/pending-requests from ReindexService.

- [`6c97099`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/6c970990c5a07f55756d29df5762dacb527b2931) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira instance metadata read tools: `jira_get_configuration` (which optional features — voting, watching, sub-tasks, time tracking, attachments, issue linking — are enabled, with the time-tracking configuration), `jira_get_status_categories` / `jira_get_status_category` (the To Do / In Progress / Done grouping behind statuses), and `jira_get_issue_picker_suggestions` (issue suggestions matching a query and/or JQL, e.g. for building a picker).

- [`284dab2`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/284dab2925e0ecb2585e4a049fa0c31da449093c) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira email template management tools (download/upload/apply/reset to default/list types) and session & WebSudo tools (get current session, create/delete a session, release an elevated-permission WebSudo session). 9 new tools total.

- [`eacc93e`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/eacc93ec49c55699767f8ddd9c98e9784ab324cf) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira entity property tools for issues, projects, and comments: get property keys, get a property, set a property, and delete a property, for each of the three entity types (12 new tools total).

- [`a87fe31`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/a87fe317b4275926aaaba35c36677cc2aa2f6e5e) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira filter-sharing tools: `jira_get_filter_share_permissions`, `jira_get_filter_share_permission`, `jira_add_filter_share_permission` (share a saved filter with a group, project, project role, all logged-in users, or globally), and `jira_delete_filter_share_permission`, plus `jira_get_default_share_scope` / `jira_set_default_share_scope` for the current user's default share scope for new filters and dashboards.

- [`d6e8187`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d6e818739fa4abec6f4a8ad1398630b5dcce5a27) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira issue lifecycle tools: restoreIssue (undo an archive), notifyIssue (send a manual email notification to reporter/assignee/watchers/voters/users/groups), setCommentPinned (pin/unpin a comment), and getPinnedComments.

- [`0cd9b9f`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/0cd9b9f17a9449195e7c5364674860e96d379572) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira issue-navigator column tools: `jira_get_my_columns` / `jira_set_my_columns` / `jira_reset_my_columns` for a user's own columns (defaulting to the current user), and `jira_get_default_columns` / `jira_set_default_columns` for the system default columns. The set operations use the endpoints' repeated `columns` form-field encoding rather than JSON.

- [`a31cb9a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/a31cb9af7bd2e4a5bd6d741c77fba3b0e29fab89) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira project lifecycle tools: createProject, updateProject, deleteProject, archiveProject, and restoreProject.

- [`ac27a9a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/ac27a9af9f357137f7eac81d8a28b969089b2d54) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira remote issue link tools: getRemoteIssueLinks, getRemoteIssueLink, createOrUpdateRemoteIssueLink, updateRemoteIssueLink, deleteRemoteIssueLink, and deleteRemoteIssueLinkByGlobalId, for linking issues to Confluence pages or other external URLs.

- [`0a48e95`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/0a48e95574050d0238e371be61229a4650460530) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add jira_getServerInfo (server version, build number, deployment type) and jira_validateLicense (validate a license string against the current installation). The generated client has no endpoint for reading the currently installed license; validateLicense is the only license-related surface it exposes.

- [`892f36d`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/892f36dad8334a0ccdc20ae39e632069a5d2b16e) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira webhook tools: `jira_get_webhooks`, `jira_get_webhook`, `jira_create_webhook` (subscribe a URL to Jira events, optionally filtered by JQL), `jira_update_webhook`, and `jira_delete_webhook`, wrapping the `/rest/webhooks/1.0/` plugin API. Note: unlike the platform REST API, the webhook endpoints do not accept personal access tokens — they require Basic auth (username/password) or a session — so these tools work only when the server is configured with Basic auth. Responses are validated softly (schema mismatches log and pass through rather than failing).

- [`f0f610c`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/f0f610c8fff882aa61f2a47c0b180e78cd604a2c) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira workflow scheme write tools: createWorkflowScheme, updateWorkflowScheme, deleteWorkflowScheme, setWorkflowSchemeIssueTypeMapping, deleteWorkflowSchemeIssueTypeMapping, setWorkflowSchemeWorkflowMapping, and deleteWorkflowSchemeWorkflowMapping.

- [`c687632`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/c687632e38a125f4970dd2693559e9fff86913c3) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Jira bulk worklog sync tools: getWorklogsDeletedSince, getWorklogsModifiedSince, and getWorklogsForIds, for polling worklog changes across the whole instance without walking every issue.

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

- [`7ac1a1f`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/7ac1a1fae2d1b9e3f19293f95bbe3ef67e51de1b) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Rewrite the internal Jira API client in a hand-written, trello.js-style shape (one function per endpoint, named parameters, resource-grouped namespaces, and a Zod schema per model) in place of the generated OpenAPI client, reusing the shared HTTP client from `datacenter-mcp-core`. No change to the exposed tools or their behavior; the generated static service classes, the mutable `OpenAPI` singleton, `CancelablePromise`, and the `__request` plumbing are gone. Service calls now read as `client.<group>.<verb>({named})` with clean method names (no `search1` / `getProperty3` suffixes), and binary downloads (attachment content, email templates) stream through the client's arraybuffer mode.

  The response Zod schemas were then verified endpoint-by-endpoint against a live Jira Data Center instance (an authenticated read + write crawl covering ~215 endpoints), correcting a batch of generated-spec inaccuracies: list endpoints typed as a single object (now arrays — e.g. `findUsers`, `getAllTabs`, `getWorkflow`, `getAssociatedProjects`, application roles, project categories), fields Jira returns as `null` rather than omitting (now `.nullish()` — `IssueBean`/`SearchResultsBean` `names`/`schema`/`expand`/`fields`, …), entity/project property values (arbitrary JSON, not `string`), the overloaded `application-properties` shape (single object with `key`, array without), and the agile epic/board issue endpoints (a search-results envelope, not a bare issue). Primitive request bodies (watcher username, user preference, license string, issue/comment property values) now send `application/json`, and the client sends `X-Atlassian-Token: no-check` so XSRF-protected bodyless mutations succeed.

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
