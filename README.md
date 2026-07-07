[![npm jira-datacenter-mcp](https://img.shields.io/npm/v/jira-datacenter-mcp.svg?label=jira-datacenter-mcp)](https://www.npmjs.com/package/jira-datacenter-mcp)
[![npm confluence-datacenter-mcp](https://img.shields.io/npm/v/confluence-datacenter-mcp.svg?label=confluence-datacenter-mcp)](https://www.npmjs.com/package/confluence-datacenter-mcp)
[![npm bitbucket-datacenter-mcp](https://img.shields.io/npm/v/bitbucket-datacenter-mcp.svg?label=bitbucket-datacenter-mcp)](https://www.npmjs.com/package/bitbucket-datacenter-mcp)
[![License: MIT](https://img.shields.io/npm/l/jira-datacenter-mcp.svg)](LICENSE)

# Atlassian Data Center MCP

> **Community project — not affiliated with, endorsed by, or supported by Atlassian.** Use at your own discretion.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers that connect **Claude Desktop**, **Claude Code**, **Cursor**, and any other MCP-compatible AI assistant to self-hosted **Atlassian Data Center** (formerly *Server*) instances: **Jira**, **Confluence**, and **Bitbucket**.

Search and manage Jira issues, read and edit Confluence pages, review Bitbucket pull requests — from your AI assistant, with credentials stored in your OS keychain instead of pasted into a client config.

| Package | Version | Server for |
|---------|---------|------------|
| [`jira-datacenter-mcp`](https://www.npmjs.com/package/jira-datacenter-mcp) | [![npm](https://img.shields.io/npm/v/jira-datacenter-mcp.svg)](https://www.npmjs.com/package/jira-datacenter-mcp) | Jira Data Center / Server |
| [`confluence-datacenter-mcp`](https://www.npmjs.com/package/confluence-datacenter-mcp) | [![npm](https://img.shields.io/npm/v/confluence-datacenter-mcp.svg)](https://www.npmjs.com/package/confluence-datacenter-mcp) | Confluence Data Center / Server |
| [`bitbucket-datacenter-mcp`](https://www.npmjs.com/package/bitbucket-datacenter-mcp) | [![npm](https://img.shields.io/npm/v/bitbucket-datacenter-mcp.svg)](https://www.npmjs.com/package/bitbucket-datacenter-mcp) | Bitbucket Data Center / Server |
| [`datacenter-mcp-core`](https://www.npmjs.com/package/datacenter-mcp-core) | [![npm](https://img.shields.io/npm/v/datacenter-mcp-core.svg)](https://www.npmjs.com/package/datacenter-mcp-core) | Shared runtime (installed automatically — not run directly) |

Each product is a separate package — install only the ones you need.

---

## Contents

- [Capabilities](#capabilities)
- [Quick start](#quick-start)
- [Connecting a client](#connecting-a-client) — [Claude Desktop](#claude-desktop) · [Claude Code](#claude-code) · [Cursor & others](#cursor--other-mcp-clients)
- [Authentication & tokens](#authentication--tokens)
- [Configuration reference](#configuration-reference)
- [Features](#features)
- [Development](#development)
- [License](#license)

---

## Capabilities

Each server exposes MCP **tools** (actions the assistant can call), **resources** (readable context endpoints), and **prompts** (ready-made workflows). Tools are grouped by domain and follow the naming pattern `<product>_verb_noun` (e.g. `jira_search_issues`, `bitbucket_get_pull_request`).

| Server | Tools | Resources | Prompts |
|--------|------:|----------:|--------:|
| Jira | **288** | 4 | 4 |
| Confluence | **112** | 4 | 4 |
| Bitbucket | **119** | 4 | 4 |

<details>
<summary><strong>Jira</strong> — 288 tools</summary>

| Group | Tools | Covers |
|-------|------:|--------|
| `issues` | 71 | search (JQL), create/update/transition, comments, worklogs, links, attachments, watchers, votes |
| `projects` | 48 | projects, versions, components, roles, categories |
| `users` | 29 | user lookup/search, groups, assignable-user queries |
| `workflows` | 25 | workflows, statuses, schemes |
| `agile` | 22 | boards, sprints, backlog, epics |
| `admin` | 93 | fields, screens, permissions, notification/security schemes, and other administrative reads/writes |

</details>

<details>
<summary><strong>Confluence</strong> — 112 tools</summary>

| Group | Tools | Covers |
|-------|------:|--------|
| `content` | 32 | pages/blogposts CRUD, bodies, versions, labels, children/descendants, search (CQL) |
| `spaces` | 30 | spaces, space content, permissions, watchers |
| `users` | 22 | users, groups, memberships |
| `admin` | 11 | global permissions, access mode, and other admin reads |
| `webhooks` | 9 | webhook registration and management |
| `attachments` | 8 | upload, download, list, update attachments |

</details>

<details>
<summary><strong>Bitbucket</strong> — 119 tools</summary>

| Group | Tools | Covers |
|-------|------:|--------|
| `repositories` | 54 | repos, branches, commits, files/browse, diffs, tags, labels, settings |
| `pullRequests` | 30 | PR CRUD, diffs/changes, inline & file comments, tasks, reviews, merge/decline, participants |
| `builds` | 13 | build status and code-insights reports |
| `permissions` | 8 | project/repository permission grants |
| `authentication` | 6 | access tokens, SSH & GPG keys |
| `projects` | 5 | project CRUD |
| `security` | 3 | security-related reads |

</details>

Every tool carries MCP annotations (read-only vs. destructive hints), and argument **completions** are provided for common identifiers (project keys, board IDs, repository slugs) so compatible clients can autocomplete them.

---

## Quick start

Each package ships an interactive `setup` command that stores credentials in the most secure place your OS offers (macOS Keychain, or a `0600` file elsewhere). Run it once per product:

```bash
npx jira-datacenter-mcp setup
npx confluence-datacenter-mcp setup
npx bitbucket-datacenter-mcp setup
```

Setup prompts for host, API base path, default page size, and API token, then makes a live authenticated request to verify everything before saving — a wrong host or token is caught immediately. Leave the token blank to configure **anonymous** (unauthenticated) access on instances that allow it.

After setup, the server boots with **zero environment variables** — see [Connecting a client](#connecting-a-client).

> **Prefer explicit config?** You can skip `setup` entirely and pass credentials via environment variables or a [shared config file](#shared-config-file) instead. See the [Configuration reference](#configuration-reference).

### Scripted / non-interactive setup

Setup accepts flags for CI or remote bootstrap (`--help` for the full list):

| Flag | Short | Description |
|------|-------|-------------|
| `--host <value>` | `-H` | Host, e.g. `jira.example.com` |
| `--api-base-path <value>` | `-b` | API base path or full URL |
| `--token <value>` | `-t` | API token (PAT) |
| `--username <value>` | `-u` | Username for Basic auth (alternative to `--token`) |
| `--password <value>` | `-p` | Password for Basic auth (with `--username`) |
| `--default-page-size <n>` | `-s` | Default page size (positive integer) |
| `--profile <name>` | `-P` | Named profile for a second instance of the same product |
| `--non-interactive` | `-n` | No prompts; exit non-zero if a required value is missing |
| `--help` | `-h` | Show usage |

```bash
# Fully scripted
npx jira-datacenter-mcp setup --non-interactive --host jira.example.com --token "$JIRA_TOKEN"

# Re-validate an already-stored token without re-entering it
npx jira-datacenter-mcp setup --non-interactive --host jira.example.com
```

In `--non-interactive` mode, missing values are resolved from existing configuration and the command exits `1` on the first validation failure — usable as a CI gate.

---

## Connecting a client

Once `setup` has stored your credentials, the `env` block can be empty. The examples below pass credentials inline for clarity; drop the `env` entries if you ran `setup`.

Set `*_HOST` to a domain (+ optional port) **without** a protocol — `https://` is assumed. To point at a non-standard path or force `http://`, use `*_API_BASE_PATH` with a full URL instead (the product-specific API suffix is appended automatically — don't include it).

### Claude Desktop

Config file: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) · `%APPDATA%\Claude\claude_desktop_config.json` (Windows). Keep only the servers you need.

```json
{
  "mcpServers": {
    "atlassian-jira-dc": {
      "command": "npx",
      "args": ["-y", "jira-datacenter-mcp"],
      "env": { "JIRA_HOST": "jira.example.com", "JIRA_API_TOKEN": "your-token" }
    },
    "atlassian-confluence-dc": {
      "command": "npx",
      "args": ["-y", "confluence-datacenter-mcp"],
      "env": { "CONFLUENCE_HOST": "confluence.example.com", "CONFLUENCE_API_TOKEN": "your-token" }
    },
    "atlassian-bitbucket-dc": {
      "command": "npx",
      "args": ["-y", "bitbucket-datacenter-mcp"],
      "env": { "BITBUCKET_HOST": "bitbucket.example.com", "BITBUCKET_API_TOKEN": "your-token" }
    }
  }
}
```

After running `setup`, this collapses to:

```json
{
  "mcpServers": {
    "atlassian-jira-dc": { "command": "npx", "args": ["-y", "jira-datacenter-mcp"] }
  }
}
```

### Claude Code

```bash
# Project scope (writes .mcp.json); add -s user for all projects
claude mcp add atlassian-jira-dc \
  -e JIRA_HOST=jira.example.com \
  -e JIRA_API_TOKEN=your-token \
  -- npx -y jira-datacenter-mcp
```

Swap `-e JIRA_HOST=…` for `-e JIRA_API_BASE_PATH=https://jira.example.com/rest`, or drop the `-e` flags entirely if you ran `setup`.

### Cursor & other MCP clients

Any stdio MCP client works. Point it at the command `npx -y <product>-datacenter-mcp` and supply credentials through its `env` mechanism (or rely on `setup`). For remote/multi-client hosting, use the [HTTP transport](#transport-stdio--http).

---

## Authentication & tokens

Three modes, resolved per request:

- **Personal Access Token (recommended)** — set `*_API_TOKEN`. Sent as `Authorization: Bearer <token>`.
- **Basic auth** — set `*_USERNAME` + `*_PASSWORD` (for older instances without PATs). Takes precedence over a token if both are configured.
- **Anonymous** — set neither. No `Authorization` header is sent; works on instances that allow unauthenticated reads.

### Generating a Personal Access Token

| Product | Path in the web UI |
|---------|--------------------|
| Jira | Profile → **Personal Access Tokens** → Create token |
| Confluence | Profile/Settings → **Personal Access Tokens** → Create token |
| Bitbucket | Manage account → **HTTP access tokens** → Create token |

Give the token the minimum permissions it needs and copy it immediately — it is shown only once.

---

## Configuration reference

### Per-product variables

Each product reads its own prefix (`JIRA_*`, `CONFLUENCE_*`, `BITBUCKET_*`):

| Variable | Required | Description |
|----------|:--------:|-------------|
| `*_HOST` | ✅¹ | Domain (+ port), no protocol — e.g. `jira.example.com` |
| `*_API_BASE_PATH` | ✅¹ | Full base URL incl. protocol — alternative to `*_HOST` |
| `*_API_TOKEN` | — | Personal Access Token (Bearer auth) |
| `*_USERNAME` / `*_PASSWORD` | — | Basic auth pair (alternative to the token) |
| `*_DEFAULT_PAGE_SIZE` | — | Default page size for paged endpoints |

¹ Provide **one** of `*_HOST` or `*_API_BASE_PATH`. The API suffix is appended for you and must **not** be included: Jira `/rest` (+ `/api/2`), Confluence `/rest/api`, Bitbucket `/rest` (+ `/api/latest`).

### Global variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ATLASSIAN_DC_MCP_CONFIG_FILE` | — | Absolute path to a shared dotenv file (see below); fails fast if set but missing |
| `ATLASSIAN_DC_MCP_PROFILE` | — | Selects a named profile's stored credentials ([multiple instances](#multiple-instances-profiles)) |
| `ATLASSIAN_DC_MCP_HTTP_PORT` | — | Serve over [HTTP](#transport-stdio--http) instead of stdio |
| `ATLASSIAN_DC_MCP_LOG_LEVEL` | `info` | `debug` · `info` · `warn` · `error` |
| `ATLASSIAN_DC_MCP_REQUEST_TIMEOUT_MS` | `30000` | Per-request timeout to the Atlassian API |
| `ATLASSIAN_DC_MCP_MAX_RESPONSE_CHARS` | `100000` | Cap on a tool result's characters; `0` disables the cap |

### Precedence

At startup each config key is resolved by walking these sources in order and taking the first non-empty value:

| Priority | Source | Provides |
|---------:|--------|----------|
| 100 | `process.env` | all keys |
| 80 | env file — `ATLASSIAN_DC_MCP_CONFIG_FILE`, or `./.env` | all keys |
| 60 | home file — `~/.atlassian-dc-mcp/<product>.env` (`%USERPROFILE%\…` on Windows) | all keys |
| 40 | macOS Keychain — service `atlassian-dc-mcp`, account `<product>-token` / `<product>-password` | token, password |

Process env always wins, so you can override a stored credential for a single session. Keychain reads are cached once at startup — tool calls never shell out.

### Shared config file

To reuse one set of credentials across several MCP hosts on a machine, put the `*_HOST` / `*_API_TOKEN` / … variables in one dotenv file and point every server at it with an absolute `ATLASSIAN_DC_MCP_CONFIG_FILE`:

```dotenv
JIRA_HOST=jira.example.com
JIRA_API_TOKEN=your-jira-token

CONFLUENCE_HOST=confluence.example.com
CONFLUENCE_API_TOKEN=your-confluence-token

BITBUCKET_HOST=bitbucket.example.com
BITBUCKET_API_TOKEN=your-bitbucket-token
```

```json
{
  "mcpServers": {
    "atlassian-jira-dc": {
      "command": "npx",
      "args": ["-y", "jira-datacenter-mcp"],
      "env": { "ATLASSIAN_DC_MCP_CONFIG_FILE": "/Users/you/.config/atlassian-dc-mcp.env" }
    }
  }
}
```

---

## Features

### Where credentials are stored

`setup` splits secrets from non-secrets:

- **macOS** — token/password go to the login Keychain (service `atlassian-dc-mcp`); the copy in the home file is cleared after a successful write, so there's never a second copy in a less-secure place.
- **Linux** — home file `~/.atlassian-dc-mcp/<product>.env`, mode `0600` (your user only).
- **Windows** — `%USERPROFILE%\.atlassian-dc-mcp\<product>.env`, inheriting your user-profile ACL.

Non-secret fields (host, base path, page size) always live in the home file.

### Multiple instances (profiles)

To run two instances of the same product (e.g. two Jira sites), give each a `--profile` at setup and select it at launch with `ATLASSIAN_DC_MCP_PROFILE`:

```bash
npx jira-datacenter-mcp setup --profile work     --host jira-work.example.com     --token "$WORK_TOKEN"
npx jira-datacenter-mcp setup --profile personal --host jira-personal.example.com --token "$PERSONAL_TOKEN"
```

```json
{
  "mcpServers": {
    "jira-work":     { "command": "npx", "args": ["-y", "jira-datacenter-mcp"], "env": { "ATLASSIAN_DC_MCP_PROFILE": "work" } },
    "jira-personal": { "command": "npx", "args": ["-y", "jira-datacenter-mcp"], "env": { "ATLASSIAN_DC_MCP_PROFILE": "personal" } }
  }
}
```

A profile only changes which home file (`<product>.<profile>.env`) and Keychain account are used.

### Transport: stdio & HTTP

By default every server speaks **stdio** — what local hosts like Claude Desktop expect. Set `ATLASSIAN_DC_MCP_HTTP_PORT` to a positive integer to serve the [Streamable HTTP transport](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http) instead (for remote/multi-client access); the two are mutually exclusive per process.

```bash
ATLASSIAN_DC_MCP_HTTP_PORT=3000 npx jira-datacenter-mcp
```

The HTTP transport carries no auth of its own beyond the configured Atlassian credentials — put your own reverse proxy, TLS, and access control in front of it before exposing it beyond localhost.

### Resilience

- **Retries** — transient failures (HTTP 429 and 5xx) are retried with exponential backoff and jitter (up to 3 attempts). A server-provided `Retry-After` header is honored (clamped to 30s) instead of the computed backoff. 4xx client errors are never retried.
- **Response cap** — tool results larger than `ATLASSIAN_DC_MCP_MAX_RESPONSE_CHARS` (default 100k chars) are truncated with a marker, so a single broad query can't flood the context window. Set `0` to disable.
- **Bounded pagination** — small, naturally finite lists (a project's versions, a page's labels) are auto-assembled into one result; open-ended searches (JQL/CQL, repo listings) stay single-page and agent-driven so they can't return an unbounded amount of data.

### Logging

All logs go to **stderr** as one JSON object per line (`{"timestamp","level","message",…}`), keeping stdout clean for the stdio protocol. Control verbosity with `ATLASSIAN_DC_MCP_LOG_LEVEL`:

```bash
ATLASSIAN_DC_MCP_LOG_LEVEL=debug npx jira-datacenter-mcp
```

---

## Development

A [pnpm](https://pnpm.io/) workspace monorepo. Four packages under `packages/`: `core` (shared runtime) and one per product.

**Prerequisites:** Node.js ≥ 26 · pnpm (pinned to `11.9.0` via `packageManager`) · a reachable Atlassian DC/Server instance.

```bash
git clone https://github.com/MrRefactoring/atlassian-dc-mcp.git
cd atlassian-dc-mcp
pnpm install

pnpm build          # build all packages (core first — others depend on its types)
pnpm typecheck      # tsc --noEmit across src + tests
pnpm lint           # ESLint (flat config, whole repo)
pnpm test           # unit tests (Vitest); the API client is mocked — no network

pnpm dev:jira       # watch-mode build for one product (also :confluence, :bitbucket)
```

Build or test a single package with `--filter`:

```bash
pnpm --filter jira-datacenter-mcp build
pnpm --filter jira-datacenter-mcp test
```

### Live smoke test

Unit tests mock the API client, so they can't catch an auth/network/API-shape regression against a real instance. Each product can run an opt-in, read-only live test that **skips itself** (not a failure) when unconfigured:

```bash
cp packages/jira/.env.live.example packages/jira/.env.live
# edit .env.live with a real host + token (or username/password)
pnpm --filter jira-datacenter-mcp test -- jira-service.live
```

`.env.live` is gitignored — never commit real credentials.

### Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets); all four packages move in lockstep (a `fixed` group). Any behavior-changing PR should include one:

```bash
pnpm changeset
```

Commit the generated `.changeset/*.md` alongside your change. Merging the resulting "Version Packages" PR is what publishes to npm and the MCP Registry.

---

## License

[MIT](LICENSE)
