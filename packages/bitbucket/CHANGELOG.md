# Change Log

## 0.6.0

### Minor Changes

- [#8](https://github.com/MrRefactoring/atlassian-dc-mcp/pull/8) [`506f588`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/506f58812dc48344a043f186cd65638550f522a6) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Paginate `bitbucket_browse_repository` with `start` and `limit`.

  `/browse` returns both a directory's children and a file's lines as a page, with `isLastPage` and `nextPageStart` to continue from. The tool sent neither `start` nor `limit`, so whatever the server chose as its default page was all you ever got: a directory with more entries than that was silently cut off, and nothing in the tool could reach the rest. For files the gap was survivable, since `bitbucket_get_file_content` reads the whole file raw, but a large directory had no way out at all.

  Both parameters are optional. `limit` defaults to the package page size, matching the other paginated tools; `start` takes the `nextPageStart` of the previous response, which sits under `children` for a directory and at the response root for a file.

- [`c42b935`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/c42b935340514b51b66eee9acad1df833956ebcb) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Stop dropping reviewers when a pull request is updated.

  `PUT /pull-requests/{id}` in Bitbucket Data Center replaces the pull request with the body it receives instead of patching it, so a body of `{version, description}` tells the server that the pull request should have no reviewers at all. Editing a description through `bitbucket_update_pull_request` removed every reviewer from the pull request. Atlassian closed this as expected behaviour in BSERV-19139 and pointed at reading the pull request before writing it.

  `bitbucket_update_pull_request` now does exactly that: it reads the pull request and sends back its title, description, draft flag and reviewers, overriding only the fields the caller passed. Passing `reviewers` still replaces the whole list, and an empty array now clears it.

  `version` became optional as a result. Pass it to keep the optimistic locking that fails the call when someone else changed the pull request in the meantime; omit it to use the version read during the update.

- [`37c8862`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/37c8862e8bb9d1203903ac2eb6597da0dae6ccd0) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Stop dropping the webhook secret and the required-builds exemption on update, and send build payloads as JSON.

  Bitbucket Data Center treats a `PUT` body as the entity's new state, not as a patch, so every field left out of the body is cleared. Probing a live 9.6.5 instance confirmed three of them:

  - `bitbucket_update_webhook` removed the stored HMAC secret whenever it was called without one, so changing a webhook's url silently unsigned every future delivery. The tool now reads the webhook and keeps its name, url, events, active state, SSL setting and secret unless you pass a replacement. An empty secret removes the stored one.
  - `bitbucket_update_required_builds_merge_check` removed the exempt ref matcher the same way. It now reads the existing check and keeps the build keys, ref matcher and exemption you leave out, and reports an unknown check id instead of writing. A matcher needs both its type and its value: passing one half now fails the call instead of silently keeping the stored matcher, and `exemptRefMatcherType: 'NONE'` removes the exemption.
  - `bitbucket_add_build_status` and both required-builds merge check tools sent their JSON body under `Content-Type: */*`, which Bitbucket answers with `415 Unsupported Media Type`. They now send `application/json`.

  Updating a project or a repository was probed as well and needs no change: Bitbucket keeps the fields those endpoints do not receive.

### Patch Changes

- [#9](https://github.com/MrRefactoring/atlassian-dc-mcp/pull/9) [`d70cf2a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d70cf2ae24566d15676ce05da4cb03b18110ec40) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Escape reserved characters in URL path parameters.

  `route`, the tagged template every client builds its paths with, encoded interpolated values with `encodeURI`. That leaves `#`, `?`, `&`, `=`, `+`, `,`, `:`, `;` and `@` untouched, so anything named with one of them produced a URL that meant something else: a repository file called `design #draft?.md` became `/browse/docs/design%20#draft?.md`, where the `#` opens a fragment and the rest of the path never reaches the server. Every endpoint that interpolates a path was affected, across all three products.

  Values are now escaped one `/`-separated segment at a time, which keeps separators in file-path parameters like `browse/{path}` while escaping everything else. Callers pass the same values as before.

- [#13](https://github.com/MrRefactoring/atlassian-dc-mcp/pull/13) [`41e943c`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/41e943c20cb3e787e3b9153e39a8dd1c95b28008) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add `bitbucket_get_pending_review`, a read-only tool that returns the authenticated user's pending draft review comments for a pull request. This lets callers detect drafts that were created before an interrupted review submission and avoid posting duplicate comments when retrying.

- Updated dependencies [[`d70cf2a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d70cf2ae24566d15676ce05da4cb03b18110ec40)]:
  - datacenter-mcp-core@0.6.0

## 0.5.0

### Minor Changes

- [`9921e0a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/9921e0a515fd79c090b43aec4b47a39cebbe49db) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add binary asset downloads across all three servers, with a shared delivery contract.

  Every download tool takes an optional absolute `outputPath`: with it the file is written to disk and only its metadata is returned, so file size is irrelevant. Without it the bytes come back as their own MCP content block — an `image` for raster images, a base64 `resource` blob otherwise — which bypasses the response cap that used to corrupt them. A file above `ATLASSIAN_DC_MCP_MAX_INLINE_BYTES` is refused with a pointer to `outputPath` instead of being silently truncated. That ceiling defaults to 1 MiB for raster images, which a host decodes as a picture, and 256 KiB for everything else, whose base64 a host has no way to read except as text — 256 KiB of it is already ~350k characters of context. Setting the variable applies a single value to both.

  **Confluence** — attachments could be listed, uploaded and replaced but never read back; there was no way to get a page's assets at all. Three new tools:

  - `confluence_download_attachment` — one attachment's bytes, identified by id or exact file name.
  - `confluence_download_page_attachments` — every attachment on a piece of content into a directory, optionally filtered by media-type prefix or exact file names, capped at 50 files with the remainder reported as skipped. A per-file failure is reported without aborting the rest.
  - `confluence_download_page_images` — the images a page actually displays, resolved from `<ac:image>` in its storage-format body (following `<ri:page>` to an image attached to another page). External `<ri:url>` images are listed rather than fetched.

  **Bitbucket** — `bitbucket_download_file` reads a repository file as bytes. `bitbucket_get_file_content` hits the same endpoint through the client's text path, which corrupts anything that is not UTF-8; its description now points at the new tool for binary files. Verified against Bitbucket Data Center 10.4.1: on a 20 000-byte binary the text path returns 36 122 bytes of replacement characters while the new tool returns the original 20 000 with a matching sha256, and a `.zip` confirms the base64 `resource` blob path for non-images.

  The Confluence tools were verified end-to-end against a Confluence Data Center 9.2.21 instance: files on disk are sha256-identical to a direct instance download, a 264 KB attachment (well past the old truncation threshold) arrives whole, and a page embedding six images — three of them attached to a different page — downloads all six.

  **Jira** — `jira_get_attachment_content` gains `outputPath` and now fetches the download URL with the client's credentials, configured request timeout and `ApiError` contract instead of a hand-rolled `fetch` that only spoke Bearer auth. **Breaking:** the response no longer carries `data.contentBase64`; the bytes arrive as a content block, or `data.savedTo` names the written file.

  Verified against Jira 11.3.8: a 150 KB attachment serialises to 200 117 characters in the old `contentBase64` envelope — comfortably past the 100 000-character response cap that silently truncated it — while the new delivery carries all 200 000 base64 characters intact in their own content block, with a sha256 matching the uploaded file. The absolute `/secure/attachment/...` content URL, which sits outside the client's `/rest` base, is fetched correctly and rejects a bad token instead of returning empty bytes.

### Patch Changes

- Updated dependencies [[`9921e0a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/9921e0a515fd79c090b43aec4b47a39cebbe49db)]:
  - datacenter-mcp-core@0.5.0

## 0.4.3

### Patch Changes

- [`e2f63c8`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/e2f63c8bf24ecf0ab997705cd69759fb4bffddcb) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Fix `bitbucket_submit_pull_request_review` not publishing the reviewer's pending (draft) comments. It called the participant-status endpoint (`PUT .../participants/{userSlug}`), which only sets an approval status and leaves draft comments unpublished — so a review was recorded but the pending comments (including inline/file comments) never appeared. It now calls the correct `PUT .../pull-requests/{id}/review` (finishReview) endpoint, which acts as the authenticated user (the PAT owner) and atomically publishes their pending comments while setting the status. The `userSlug` argument is no longer required (the review is always submitted as the token owner) and an optional `commentText` summary is now supported. Verified live against Bitbucket DC 9.3.

- Updated dependencies []:
  - datacenter-mcp-core@0.4.3

## 0.4.2

### Patch Changes

- [`7202a08`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/7202a088cd74c26ea306873615ebbcda10f3e40e) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Fix inline pull-request and commit comments silently posting as general (unanchored) comments. The comment client assembles the POST body with `pickBody(params, CommentSchema)`, but `CommentSchema` did not declare `anchor` (file/line attachment) or `parent` (reply reference), so those fields were stripped from the request: an inline comment landed as a top-level PR comment and a reply landed as a new thread. Both fields are now part of `CommentSchema` and reach the server. Added an api-layer regression test that asserts the fields survive body assembly (the existing service-level tests mock the client namespace and could not catch this).

- Updated dependencies []:
  - datacenter-mcp-core@0.4.2

## 0.4.1

### Patch Changes

- Updated dependencies [[`9d61f30`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/9d61f30c5053df05ef11c8eab8b2640d527b1124)]:
  - datacenter-mcp-core@0.4.1

## 0.4.0

### Minor Changes

- [`d336f34`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/d336f3416f667bdaa8f4b6f5cfc39fd36634abe2) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Expand the Bitbucket MCP surface (all additions live-verified against a Bitbucket Data Center 9.3.2 instance):

  - **5 new read tools**: `bitbucket_get_commit_changes` (files changed in a commit), `bitbucket_get_commit_pull_requests` (PRs containing a commit), `bitbucket_get_compare_diff` (raw diff between two refs), `bitbucket_get_repository_labels`, and `bitbucket_get_pull_request_blocker_comments` (a PR's unresolved tasks).
  - **2 new resources**: `bitbucket://project/{key}` and `bitbucket://commit/{key}/{slug}/{commitId}`, alongside the existing repo and pull-request resources.
  - **3 new prompts**: `bitbucket_triage_open_pull_requests`, `bitbucket_investigate_merge_readiness`, and `bitbucket_prepare_pull_request`, alongside the existing review prompt.
  - **Opt-in pagination**: `bitbucket_get_branches` and `bitbucket_get_tags` accept `fetchAll` to follow pagination and return every page as a flat array (safety-capped). Commit and pull-request listings stay single-page.

- [`6df9e9d`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/6df9e9de4933533a7d99c3752fc2af3232cd9229) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Roll tool annotations out to Confluence (101 tools) and Bitbucket (114 tools) via the shared `registerAnnotatedTool` helper, so every tool across all three products now advertises `readOnlyHint`/`destructiveHint`/`idempotentHint`/`title`/`openWorldHint`.

  The core classifier learned the vocabulary these products use: it skips the `admin_` namespace token so `confluence_admin_delete_user` is correctly flagged destructive, treats `convert`/`compare`/`browse`/`can`/`is` as read-only, and classifies `grant`/`revoke`/`enable`/`disable`/`watch`/`unwatch`/`edit` as idempotent non-destructive writes. Pull-request and version merges are flagged destructive.

- [`8e5a1e3`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/8e5a1e32c9d6459775fa7ee05922771f713c215c) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Add two MCP protocol maturity features across all three products:

  - **Server `instructions`**: each server now advertises an `instructions` string in its `initialize` result, telling the client/model what the server is, that every call acts as the single configured user, the `<product>_<verb>_<noun>` naming and read/write/destructive annotations, how to search (JQL/CQL), the `fetchAll` pagination opt-in, and the addressable resource URIs. `createMcpServer` gained an optional `instructions` field.
  - **Argument completions (`completion/complete`)**: prompt arguments and resource-template variables now offer live autocompletion, backed by list endpoints and filtered against the partial input (case-insensitive substring, capped). Confluence completes `spaceKey`; Jira completes `projectKey` and `boardId`; Bitbucket completes `projectKey` and (scoped to the chosen project) `repositorySlug`. A shared `filterCompletions` helper was added to core. Completions never throw — a failed lookup yields an empty list. Verified live against Confluence Data Center 9.2.21 and Bitbucket Data Center 9.3.2 instances.

### Patch Changes

- Updated dependencies [[`6df9e9d`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/6df9e9de4933533a7d99c3752fc2af3232cd9229), [`6bdf2db`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/6bdf2dbaa5340aa5e9e25bc5dc37edfccf60c460), [`7f1c16a`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/7f1c16a1671ffee0e53881da90fb2870220982a1), [`8e5a1e3`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/8e5a1e32c9d6459775fa7ee05922771f713c215c)]:
  - datacenter-mcp-core@0.4.0

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
