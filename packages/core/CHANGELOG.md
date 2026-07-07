# Change Log

## 0.4.1

### Patch Changes

- [`9d61f30`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/9d61f30c5053df05ef11c8eab8b2640d527b1124) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Honor the `Retry-After` response header on rate-limited/unavailable responses. The hand-written HTTP client now parses `Retry-After` (delta-seconds or HTTP-date) into `ApiError.retryAfterMs`, and `handleApiOperation` uses it as the wait before the next retry instead of its own exponential backoff when the server provides one. The honored delay is clamped to a new `maxRetryAfterMs` retry option (default 30s) so a large server value can never hang a tool call, and the retry log records whether `Retry-After` was honored. All three products benefit uniformly since they share the core client. A new `parseRetryAfterMs` helper is exported for reuse.

## 0.4.0

### Minor Changes

- [`6df9e9d`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/6df9e9de4933533a7d99c3752fc2af3232cd9229) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Roll tool annotations out to Confluence (101 tools) and Bitbucket (114 tools) via the shared `registerAnnotatedTool` helper, so every tool across all three products now advertises `readOnlyHint`/`destructiveHint`/`idempotentHint`/`title`/`openWorldHint`.

  The core classifier learned the vocabulary these products use: it skips the `admin_` namespace token so `confluence_admin_delete_user` is correctly flagged destructive, treats `convert`/`compare`/`browse`/`can`/`is` as read-only, and classifies `grant`/`revoke`/`enable`/`disable`/`watch`/`unwatch`/`edit` as idempotent non-destructive writes. Pull-request and version merges are flagged destructive.

- [`6bdf2db`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/6bdf2dbaa5340aa5e9e25bc5dc37edfccf60c460) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Mature the Jira MCP surface:

  - **Tool annotations** on all Jira tools. A new `deriveToolAnnotations` / `registerAnnotatedTool` helper in core derives `readOnlyHint`/`destructiveHint`/`idempotentHint`/`title`/`openWorldHint` from each tool's `<product>_<verb>_<noun>` name, so hosts can auto-approve read-only calls and warn before destructive ones (delete/remove/merge-version).
  - **More resources**: added `jira://project/{key}`, `jira://board/{id}`, and `jira://user/{username}` alongside the existing `jira://issue/{key}`.
  - **More prompts**: added `jira_plan_sprint`, `jira_break_down_epic`, and `jira_build_jql` alongside `jira_triage_issue`.
  - **Opt-in pagination**: the bounded agile listers (`jira_get_boards`, `jira_get_board_sprints`, `jira_get_board_versions`, `jira_get_board_epics`) accept `fetchAll` to follow pagination and return every page as a flat array (safety-capped). The JQL-backed issue listings stay single-page and agent-driven.

- [`7f1c16a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/7f1c16a1671ffee0e53881da90fb2870220982a1) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add a configurable response-size cap so oversized API responses no longer blow the model's context window. Every tool response is serialized through `formatToolResponse`, which now truncates payloads larger than `ATLASSIAN_DC_MCP_MAX_RESPONSE_CHARS` (default 100,000 characters, ~25k tokens) and appends a clear marker explaining the payload was cut and how to get the rest (narrow the query, use a smaller limit or pagination, request specific fields). Set the env var to `0` to disable the cap. This protects Jira, Confluence, and Bitbucket uniformly against large diffs, long page bodies, and big unfiltered list results.

- [`8e5a1e3`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/8e5a1e32c9d6459775fa7ee05922771f713c215c) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add two MCP protocol maturity features across all three products:

  - **Server `instructions`**: each server now advertises an `instructions` string in its `initialize` result, telling the client/model what the server is, that every call acts as the single configured user, the `<product>_<verb>_<noun>` naming and read/write/destructive annotations, how to search (JQL/CQL), the `fetchAll` pagination opt-in, and the addressable resource URIs. `createMcpServer` gained an optional `instructions` field.
  - **Argument completions (`completion/complete`)**: prompt arguments and resource-template variables now offer live autocompletion, backed by list endpoints and filtered against the partial input (case-insensitive substring, capped). Confluence completes `spaceKey`; Jira completes `projectKey` and `boardId`; Bitbucket completes `projectKey` and (scoped to the chosen project) `repositorySlug`. A shared `filterCompletions` helper was added to core. Completions never throw — a failed lookup yields an empty list. Verified live against Confluence Data Center 9.2.21 and Bitbucket Data Center 9.3.2 instances.

## 0.3.0

### Minor Changes

- [`7ac1a1f`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/7ac1a1fae2d1b9e3f19293f95bbe3ef67e51de1b) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Lift the HTTP client core into `datacenter-mcp-core` so every product package shares one implementation. `createHttpClient`, the `route` tagged-template URL builder, `pickBody`, `bindGroup`, `ApiError`, and the client interfaces (`HttpClient`, `SendRequestOptions`, `HttpClientConfig`, …) now live in and are exported from core; a new `responseType: 'arraybuffer'` mode returns the raw bytes for binary downloads, and a new `softValidation` config flag validates responses non-fatally (a schema mismatch logs a warning and passes the raw body through instead of throwing) for clients whose schemas aren't yet fully verified against a live instance. Response parsing also tolerates an empty body on a 200/201 that still advertises a JSON `Content-Type` (some mutation endpoints answer this way), returning `undefined` instead of throwing on `JSON.parse('')`. The Bitbucket client drops its local copies and imports these from core, with no change to its behavior or exposed tools.

### Patch Changes

- [`9126faa`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/9126faaf28d181f1d80d629682fd85a17830c939) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Make every `index.ts` a pure barrel (re-exports only). Each product's tool-registration/bootstrap entry moves from `src/index.ts` to `src/server.ts` (imported by the `run.ts` bin dispatcher and the start/dev/inspect scripts), and `src/index.ts` becomes a barrel over the service, config, and mappers. In core, the `createMcpServer`/`connectServer`/`formatToolResponse` runtime moves to `src/server.ts` and `index.ts` re-exports it, so the `datacenter-mcp-core` public API is unchanged. No change to the `npx <product>-datacenter-mcp [setup]` command or server behavior.

- [`d220a9e`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d220a9ee0eff2e006f8b44d262d6a697b1a25884) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Improve npm discoverability: mention Claude/AI assistants in package descriptions and add search keywords (mcp-server, claude, claude-desktop, anthropic, ai, llm, and product-specific aliases like jira-server/confluence-server/bitbucket-server).

## 0.2.0

### Minor Changes

- [`582a094`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/582a094960ba6d74453aabefa4ed44522ac07351) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Allow the MCP servers to start and run without an API token, for Data Center instances that permit anonymous access. `*_API_TOKEN` is no longer required by config validation or the interactive `setup` CLI; when it's absent, requests are sent with no `Authorization` header instead of the previous placeholder-token workaround.
