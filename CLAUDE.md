# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (pnpm workspace monorepo)
pnpm install

# Build all packages (core must build first — other packages depend on its types)
pnpm build

# Build a single package
pnpm --filter jira-datacenter-mcp build
pnpm --filter confluence-datacenter-mcp build
pnpm --filter bitbucket-datacenter-mcp build
pnpm --filter datacenter-mcp-core build

# Run all tests (Vitest, per package)
pnpm test

# Run tests for one package
pnpm --filter jira-datacenter-mcp test

# Run a single test by name
pnpm --filter jira-datacenter-mcp exec vitest run -t 'test name'

# Typecheck (tsc --noEmit over src + tests; vitest itself doesn't type-check)
pnpm typecheck

# Lint (ESLint flat config, root-level — covers all packages; the generated jiraClient/ and confluenceClient/ dirs are excluded, but the hand-written bitbucketClient/ is linted)
pnpm lint
pnpm lint:fix

# Opt-in E2E smoke test against a real Jira DC instance (skips itself with no config; see packages/jira/.env.live.example)
pnpm --filter jira-datacenter-mcp test -- jira-service.live

# Dev mode (tsc --watch) per product
pnpm dev:jira
pnpm dev:confluence
pnpm dev:bitbucket

# Changeset for a release-worthy PR
pnpm changeset
```

## Architecture

This is a pnpm workspace monorepo publishing four npm packages from `packages/`:

- **`core`** (`datacenter-mcp-core`) — shared runtime: MCP server bootstrap, layered config resolution, error handling, and the interactive `setup` CLI. Every product package depends on it via `workspace:^`.
- **`jira`** (`jira-datacenter-mcp`), **`confluence`** (`confluence-datacenter-mcp`), **`bitbucket`** (`bitbucket-datacenter-mcp`) — one MCP server per Atlassian product, structurally identical to each other.

### Per-product package structure

Each product package follows the same shape:

- **`src/server.ts`** — entry point / orchestrator. Initializes runtime config, validates required env vars, constructs the service and the MCP server (`createMcpServer`), calls the `register*(server, service)` functions from `src/tools/`, `src/resources.ts`, and `src/prompts.ts`, then `connectServer` to start listening on stdio. It contains no `server.registerTool` calls itself — just wiring.
- **`src/tools/<group>.ts`** — the actual tool registrations, grouped by resource/domain. bitbucket mirrors the client's `api/` namespaces (`projects`, `repositories`, `pullRequests`, `builds`, `permissions`, `authentication`, `security`); jira uses `issues`, `projects`, `users`, `workflows`, `agile`, `admin`; confluence uses `content`, `spaces`, `attachments`, `users`, `webhooks`, `admin`. Each file exports `register<Group>Tools(server, service)` — a flat, repetitive list of `server.registerTool(name, { description, inputSchema }, handler)` calls. When adding a tool, follow the neighbouring pattern rather than introducing abstraction.
- **`src/resources.ts` / `src/prompts.ts`** — `registerResources(server, service)` and `registerPrompts(server[, service])`, one per file, for the product's MCP resources and prompts.
- **`src/constants.ts`** (jira/confluence) — the shared `<product>InstanceType` description string imported by the tool modules.
- **`src/run.ts`** — the compiled bin entry (`package.json` `bin` → `dist/run.js`). A tiny dispatcher: `run setup` dynamically imports `./setup.js`, otherwise it imports `./server.js` to boot the MCP server.
- **`src/index.ts`** — barrel only (re-exports the service, config, and mappers as the package's library surface). It is not the executable and has no side effects; the runnable entry is `server.ts`.
- **`src/<product>Service.ts`** — a `<Product>Service` class wrapping the product's API client. Exposes one method per tool, each delegating to `handleApiOperation` (from `core`) for consistent success/error response shaping. Also exports the `zod` schemas (`jiraToolSchemas`, etc.) consumed by the `src/tools/*.ts` modules.
- **`src/<product>Client/`** — the API client. **jira/confluence**: a generated OpenAPI client (services + models + `core/` request plumbing) committed to the repo, not regenerated at build time — treat those files as generated output and prefer changing how `<product>Service.ts` calls into them over hand-editing. **bitbucket**: a hand-written [trello.js](https://github.com/MrRefactoring/trello.js)-style client — `core/` (a `createBitbucketClient` factory over a small `httpClient`, plus `helpers.ts` with the `route` tagged-template URL builder and `pickBody`), `api/` (one free function per endpoint, grouped by resource into namespaces), `parameters/` (one flat Zod schema per endpoint's named parameters, request body fields flattened in), `models/` (one Zod schema + inferred type per model), and `interface/` (client types: `HttpClient`, `SendRequestOptions`, `RestPage`, …). It is normal hand-written code: linted, and edited directly. The service constructs it once (`this.bb = createBitbucketClient({...})`) and calls `this.bb.<group>.<fn>({named})`.
- **`src/config.ts`** — declares a `ProductDefinition` (env var names, default API base path, strippable suffixes) and exposes `get<Product>RuntimeConfig()` / `getMissingConfig()` built on `core`'s config layer.
- **`src/setup.ts`** — wires the product's `ProductDefinition` into `core`'s shared `runSetupCli`, producing the product's `setup` subcommand (dispatched by `src/run.ts`).

### Core package internals (`packages/core/src`)

- **Config resolution** (`config/`) — `DefaultConfigRegistry` walks a priority-ordered list of `ReadableSource`s (highest first) and returns the first non-empty value per key: `process.env` (100) → env file pointed to by `ATLASSIAN_DC_MCP_CONFIG_FILE` or `./.env` (80) → home file `~/.atlassian-dc-mcp/<product>.env` (60) → macOS Keychain, token only (40). `resolveBase.ts` derives the final API base URL from host/apiBasePath/defaults. This layering is what lets a server boot with zero env vars once `setup` has run once.
- **`setupCli.ts` / `setup/`** — the interactive (and `--non-interactive`) `setup` subcommand shared by all three products: prompts, arg parsing (`setup/args.ts`), input validation (`setup/valueValidator.ts`), and error formatting (`setup/describeError.ts`). It performs a live authenticated request against the target instance before saving credentials, and writes tokens to Keychain (macOS) or a `0600` home file (Linux/Windows), never both.
- **`apiErrorHandler.ts`** — `handleApiOperation<T>(operation, errorPrefix)` is the single error-handling convention used by every service method; it normalizes both thrown `Error`s and the generated client's `{status, body, statusText}` API error shape into `{success, data?, error?, details?}`.
- **`server.ts`** — `createMcpServer`, `connectServer` (stdio transport), and `formatToolResponse` (wraps a result as MCP tool JSON text content) are the glue every product's `server.ts` uses identically. `index.ts` is a barrel that re-exports these (via `export * from './server.js'`) alongside the config, pagination, and setup helpers, so consumers still import them from the `datacenter-mcp-core` bare specifier.

### Adding a new tool to a product

The consistent path is: add a client-backed method to `<product>Service.ts` (using `handleApiOperation`), add its Zod schema to the exported schema object, then register a `server.registerTool(name, { description, inputSchema }, handler)` call in the matching `src/tools/<group>.ts`, following the neighboring tools' `snake_case` naming (`<product>_verb_noun`, e.g. `bitbucket_get_projects`) and description conventions.

## Engineering Principles

Apply these to **everything** written in this repo — production code, tests, scripts, config.

- **KISS** — keep it simple. Prefer the most straightforward solution that works. No clever code where plain code does the job.
- **YAGNI** — build only what the current task requires. No speculative features, options, abstractions, or "future-proofing" for requirements that don't exist yet.
- **DRY** — no duplicated knowledge. Extract a shared helper when the *same* logic appears in multiple places — but don't over-DRY: two superficially similar lines that may diverge are not duplication. KISS/YAGNI win ties.
- **SOLID**
  - **S** — Single responsibility: each module, component, hook, or function does one thing.
  - **O** — Open/closed: extend behavior via new code (new ports, props, variants), not by editing stable internals.
  - **L** — Liskov substitution: implementations of a port/interface must be interchangeable without surprising callers.
  - **I** — Interface segregation: keep props and trait surfaces narrow; don't force consumers to depend on what they don't use.
  - **D** — Dependency inversion: depend on abstractions — in the client that means `client/src/lib/api.ts` and `lib/socket.ts` (the dual Tauri/HTTP transport shims), never raw Tauri `invoke`, `fetch`, or socket.io directly from components; in Rust, traits over concrete services.

Principle conflicts resolve toward simplicity: KISS and YAGNI take precedence over premature SOLID/DRY structure.
