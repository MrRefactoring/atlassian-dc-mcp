# Change Log

## 0.3.0

### Minor Changes

- [#7](https://github.com/MrRefactoring/atlassian-dc-mcp/pull/7) [`61adb53`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/61adb53e367b61ec85af0dad69414e7febce6c79) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add comprehensive Bitbucket Track B tools: HTTP access token (PAT) management; SSH and GPG key lifecycle; project and repository permission controls; repository settings (default branch, PR settings, hooks); and branch model configuration.

- [`520ddfd`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/520ddfd23b6b696f138f30063f66c1df6bcf9115) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add Basic auth (username/password) support to bitbucket-datacenter-mcp as an alternative to the API token, with Keychain-backed password storage on macOS.

- [`983d08a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/983d08a09c500b9f6a4183b5580aa59d6c62c901) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add bitbucket_getPullRequestParticipants to list everyone who has interacted with a pull request (author, reviewers, and anyone who has commented or approved), distinct from the existing reviewer-management tools which only cover explicitly requested reviewers.

- [`95d8f00`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/95d8f004a9fe0160441990a7e8a31287d93d845c) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add repository-level auto-decline and auto-merge settings tools (get/set/delete for each), covering two pull-request-lifecycle settings blocks not previously exposed alongside the existing pull request settings, branch restrictions, and hooks tools.

- [`bddd013`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/bddd013c49941aec005ea64b70bbd87b5452349d) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add bitbucket_getRepositoryForks to list the direct forks of a repository, complementing the existing bitbucket_forkRepository create tool.

- [`868ed80`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/868ed806d79067527f8f084eed3b3bd4786e5e58) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add a first-class named-profile concept for managing more than one instance of the same product. `setup --profile <name>` reads/writes a distinct home file (`<product>.<profile>.env`) and Keychain account (`<product>-<profile>-token`/`-password`) instead of the default unsuffixed ones; set `ATLASSIAN_DC_MCP_PROFILE=<name>` when launching the server to read that profile back. `process.env` and `ATLASSIAN_DC_MCP_CONFIG_FILE` are unaffected and still take priority, as before.

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

- [`35a7b22`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/35a7b22d5c2cb6f232ae2bd7e39eefe3b08a266a) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Validate the optional `anchor` field when checking whether a raw API response is a well-formed pull request comment, closing a gap where a malformed anchor could silently produce a broken simplified anchor instead of being rejected.

- [`c5384e5`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/c5384e5534350939327e2bfe4ec7aabaa5cf9f67) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Rewrite the internal Bitbucket API client in a hand-written, trello.js-style shape (one function per endpoint, named parameters, resource-grouped namespaces, and a Zod schema per model) in place of the generated OpenAPI client. No change to the exposed tools or their behavior; the generated static service classes, the mutable `OpenAPI` singleton, and `CancelablePromise` plumbing are gone, and response bodies are now runtime-validated against Zod schemas derived from real Bitbucket Data Center responses.

- [`7ac1a1f`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/7ac1a1fae2d1b9e3f19293f95bbe3ef67e51de1b) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Lift the HTTP client core into `datacenter-mcp-core` so every product package shares one implementation. `createHttpClient`, the `route` tagged-template URL builder, `pickBody`, `bindGroup`, `ApiError`, and the client interfaces (`HttpClient`, `SendRequestOptions`, `HttpClientConfig`, …) now live in and are exported from core; a new `responseType: 'arraybuffer'` mode returns the raw bytes for binary downloads, and a new `softValidation` config flag validates responses non-fatally (a schema mismatch logs a warning and passes the raw body through instead of throwing) for clients whose schemas aren't yet fully verified against a live instance. Response parsing also tolerates an empty body on a 200/201 that still advertises a JSON `Content-Type` (some mutation endpoints answer this way), returning `undefined` instead of throwing on `JSON.parse('')`. The Bitbucket client drops its local copies and imports these from core, with no change to its behavior or exposed tools.

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
