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

# Run all tests (Jest, per package)
pnpm test

# Run tests for one package
pnpm --filter jira-datacenter-mcp test

# Run a single test by name
pnpm --filter jira-datacenter-mcp exec jest -t 'test name'

# Dev mode (tsc --watch) per product
pnpm dev:jira
pnpm dev:confluence
pnpm dev:bitbucket

# Live-debug a running MCP server over stdio
pnpm debug
pnpm debug:verbose

# Changeset for a release-worthy PR
pnpm changeset
```

## Architecture

This is a pnpm workspace monorepo publishing four npm packages from `packages/`:

- **`core`** (`datacenter-mcp-core`) — shared runtime: MCP server bootstrap, layered config resolution, error handling, and the interactive `setup` CLI. Every product package depends on it via `workspace:^`.
- **`jira`** (`jira-datacenter-mcp`), **`confluence`** (`confluence-datacenter-mcp`), **`bitbucket`** (`bitbucket-datacenter-mcp`) — one MCP server per Atlassian product, structurally identical to each other.

### Per-product package structure

Each product package follows the same three-layer shape:

- **`src/index.ts`** — entry point. Initializes runtime config, validates required env vars, constructs the service, creates an MCP server via `createMcpServer`, registers one `server.tool(...)` call per capability (name, description, Zod schema, handler), then calls `connectServer` to start listening on stdio. This file is a flat, repetitive list of tool registrations — when adding a new tool, follow the existing pattern rather than introducing abstraction.
- **`src/<product>-service.ts`** — a `<Product>Service` class wrapping the generated API client. Exposes one method per tool, each delegating to `handleApiOperation` (from `core`) for consistent success/error response shaping. Also exports the `zod` schemas (`jiraToolSchemas`, etc.) consumed by `index.ts`.
- **`src/<product>-client/`** — a generated OpenAPI client (services + models + `core/` request plumbing) committed to the repo, not regenerated at build time. Treat files here as generated output: prefer changing how `<product>-service.ts` calls into them over hand-editing generated code.
- **`src/config.ts`** — declares a `ProductDefinition` (env var names, default API base path, strippable suffixes) and exposes `get<Product>RuntimeConfig()` / `getMissingConfig()` built on `core`'s config layer.
- **`src/setup.ts`** — wires the product's `ProductDefinition` into `core`'s shared `runSetupCli`, producing the product's `setup` subcommand (see `bin/`).

### Core package internals (`packages/core/src`)

- **Config resolution** (`config/`) — `DefaultConfigRegistry` walks a priority-ordered list of `ReadableSource`s (highest first) and returns the first non-empty value per key: `process.env` (100) → env file pointed to by `ATLASSIAN_DC_MCP_CONFIG_FILE` or `./.env` (80) → home file `~/.atlassian-dc-mcp/<product>.env` (60) → macOS Keychain, token only (40). `resolve-base.ts` derives the final API base URL from host/apiBasePath/defaults. This layering is what lets a server boot with zero env vars once `setup` has run once.
- **`setup-cli.ts` / `setup/`** — the interactive (and `--non-interactive`) `setup` subcommand shared by all three products: prompts, arg parsing (`setup/args.ts`), input validation (`setup/value-validator.ts`), and error formatting (`setup/describe-error.ts`). It performs a live authenticated request against the target instance before saving credentials, and writes tokens to Keychain (macOS) or a `0600` home file (Linux/Windows), never both.
- **`api-error-handler.ts`** — `handleApiOperation<T>(operation, errorPrefix)` is the single error-handling convention used by every service method; it normalizes both thrown `Error`s and the generated client's `{status, body, statusText}` API error shape into `{success, data?, error?, details?}`.
- **`index.ts`** — `createMcpServer`, `connectServer` (stdio transport), and `formatToolResponse` (wraps a result as MCP tool JSON text content) are the glue every product's `index.ts` uses identically.

### Adding a new tool to a product

The consistent path is: add a client-backed method to `<product>-service.ts` (using `handleApiOperation`), add its Zod schema to the exported schema object, then register a `server.tool(...)` call in `index.ts` following the neighboring tools' naming (`<product>_verbNoun`) and description conventions.

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
