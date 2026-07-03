# Atlassian Confluence Data Center MCP

This package provides a Machine Comprehension Protocol (MCP) server for interacting with Atlassian Confluence Data Center edition.

## Interactive Setup

The easiest way to configure this server is the built-in `setup` subcommand:

```bash
npx confluence-datacenter-mcp setup
```

It prompts for host, API base path, default page size, and API token, then stores them in the most secure place available:

- **macOS** — token in the login Keychain (service `atlassian-dc-mcp`, account `confluence-token`); host / base path / page size in `~/.atlassian-dc-mcp/confluence.env` (mode `0600`).
- **Linux** — everything in `~/.atlassian-dc-mcp/confluence.env` with POSIX mode `0600` (read/write for your user only).
- **Windows** — everything in `%USERPROFILE%\.atlassian-dc-mcp\confluence.env`. Node passes the mode bits but Windows ignores them, so the file inherits the ACL of your user profile directory (typically readable only by your user, SYSTEM, and Administrators).

After setup, you can launch the server without any environment variables:

```json
{
  "mcpServers": {
    "atlassian-confluence-dc": {
      "command": "npx",
      "args": ["-y", "confluence-datacenter-mcp"]
    }
  }
}
```

Environment variables still override stored values — see [Configuration sources](#configuration-sources) below.

### Scripted / non-interactive setup

For CI, remote sessions, or shell scripts, pass values as flags and add `--non-interactive` to skip prompts:

```bash
npx confluence-datacenter-mcp setup --non-interactive \
  --host confluence.example.com \
  --token "$CONFLUENCE_TOKEN"
```

Available flags: `--host`/`-H`, `--api-base-path`/`-b`, `--token`/`-t`, `--default-page-size`/`-s`, `--non-interactive`/`-n`, `--help`/`-h`. In `--non-interactive` mode, missing values fall back to existing configuration and the run exits non-zero only if a host (or full-URL `--api-base-path`) cannot be resolved. The token is optional — omit it for anonymous access; an existing token is reused when `--token` is omitted. Run `npx confluence-datacenter-mcp setup --help` for full usage.

## Features

- Get content by ID
- Search for content using CQL (Confluence Query Language)
- Create new content (pages, blog posts)
- Update existing content

## Setup

1. Install dependencies:
   ```
   pnpm install
   ```

2. Create a `.env` file in the packages/confluence directory, or put the same values in a shared dotenv file and set `ATLASSIAN_DC_MCP_CONFIG_FILE` to its absolute path:
   ```
   # Either CONFLUENCE_HOST or CONFLUENCE_API_BASE_PATH must be set
   CONFLUENCE_HOST=your-confluence-instance.atlassian.net
   # Optional: omit for anonymous access if your instance allows unauthenticated reads
   CONFLUENCE_API_TOKEN=your-personal-access-token

   # Alternative to CONFLUENCE_API_TOKEN: Basic auth with username + password (e.g. for
   # older instances without personal access tokens). If both are set, Basic auth
   # takes precedence over the Bearer token.
   # CONFLUENCE_USERNAME=your-username
   # CONFLUENCE_PASSWORD=your-password

   # Optional: Use one of the following approaches:
   # 1. If your Confluence instance hosted on the subpath:
   # CONFLUENCE_API_BASE_PATH=https://your-confluence-instance.atlassian.net/sub-path

   # 2. Or continue using CONFLUENCE_HOST with the default API path (/rest):
   # CONFLUENCE_HOST=your-confluence-instance.atlassian.net

   # Optional: default page size for paginated search tools (fallback: 25)
   CONFLUENCE_DEFAULT_PAGE_SIZE=25
    ```

   Shared file example:
   ```
   CONFLUENCE_HOST=your-confluence-instance.atlassian.net
   CONFLUENCE_API_TOKEN=your-personal-access-token
   CONFLUENCE_DEFAULT_PAGE_SIZE=25
   ```

   Start the server with:
   ```
   ATLASSIAN_DC_MCP_CONFIG_FILE=/absolute/path/to/atlassian-dc-mcp.env pnpm dev
   ```

   Windows example:
   ```
   set ATLASSIAN_DC_MCP_CONFIG_FILE=C:\Users\your-user\AppData\Roaming\atlassian-dc-mcp.env
   pnpm dev
   ```

   Note: You have two options for configuring the API URL:

   1. Set `CONFLUENCE_API_BASE_PATH` to the full API URL (e.g., "https://host.com/rest/api" or "https://host.com/wiki/rest/api").
      When this is set, the `CONFLUENCE_HOST` variable is ignored.

   2. Set `CONFLUENCE_HOST` only, which will use the default API path (/rest).

   3. Confluence uses `/rest` as a path part always, so it will be added automatically, no need to add it manually.

   See [Configuration sources](#configuration-sources) for the full precedence chain.

   To create a personal access token:
   - In Confluence, select your profile picture at the top right
   - Select **Settings** > **Personal Access Tokens**
   - Select **Create token** and give it a name
   - Copy the token and store it securely (you won't be able to see it again)

## Configuration sources

Each key is resolved by walking these sources in priority order and taking the first non-empty value:

| Priority | Source | Reads | Written by `setup` |
|---------:|--------|-------|--------------------|
| 100 | `process.env` (`CONFLUENCE_HOST`, `CONFLUENCE_API_BASE_PATH`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_USERNAME`, `CONFLUENCE_PASSWORD`, `CONFLUENCE_DEFAULT_PAGE_SIZE`) | all keys | — |
| 80  | env file — `ATLASSIAN_DC_MCP_CONFIG_FILE` (absolute path) or `./.env` | all keys | — |
| 60  | home file — `~/.atlassian-dc-mcp/confluence.env` on macOS/Linux, `%USERPROFILE%\.atlassian-dc-mcp\confluence.env` on Windows (mode `0600` on POSIX; Windows inherits the user-profile ACL) | all keys | host, apiBasePath, username, defaultPageSize (always); token, password (non-darwin or keychain fallback) |
| 40  | macOS Keychain — service `atlassian-dc-mcp`, accounts `confluence-token` / `confluence-password` | token, password | token, password (darwin only) |

`setup` always writes non-secret fields (including username) to the home file and tries the keychain first for the token and password. Basic auth (username/password) takes precedence over the Bearer token when both are configured. If a higher-priority source shadows the value being saved, `setup` prints a warning so you can unset the env var.

## Usage

Start the MCP server:

```
pnpm build
pnpm start
```

Or for development with auto-reload:

```
pnpm dev
```

## Testing

Run the test suite from the package directory:

```
pnpm test
```

Or from the repository root:

```
pnpm --filter confluence-datacenter-mcp test
```

### Available Tools

The server registers 48 tools, grouped below by area. All tools operate against a Confluence Data Center edition instance.

#### Content — CRUD & search (CQL)

- `confluence_getContent` — Get Confluence content by ID
- `confluence_searchContent` — Search for content using CQL
- `confluence_createContent` — Create new content
- `confluence_updateContent` — Update existing content
- `confluence_deleteContent` — Delete (trash or purge) content

#### Content structure — history, children, descendants

- `confluence_getContentHistory` — Get the version history of content
- `confluence_getContentChildren` — Get the direct children of a piece of content
- `confluence_getContentChildrenByType` — Get the children of a piece of content limited to a single type
- `confluence_getContentDescendants` — Get the descendants of a piece of content
- `confluence_getContentDescendantsByType` — Get the descendants of a piece of content limited to a single type

#### Comments (read-only)

- `confluence_getContentComments` — Get the comments of a piece of content

#### Labels

- `confluence_getContentLabels` — Get the labels attached to a piece of content
- `confluence_addContentLabels` — Add one or more labels to a piece of content
- `confluence_deleteContentLabel` — Remove a label from a piece of content

#### Content properties

- `confluence_getContentProperties` — Get the properties stored on a piece of content
- `confluence_getContentProperty` — Get a single content property by key
- `confluence_createContentProperty` — Create a content property
- `confluence_updateContentProperty` — Update a content property
- `confluence_deleteContentProperty` — Delete a content property

#### Restrictions

- `confluence_getContentRestrictions` — Get all restrictions on a piece of content, grouped by operation
- `confluence_getContentRestrictionsByOperation` — Get the restrictions on a piece of content for a single operation
- `confluence_updateContentRestrictions` — Overwrite the restrictions on a piece of content

#### Watches

- `confluence_getContentWatchers` — List the users watching a piece of content
- `confluence_isWatchingContent` — Check whether a user is watching a piece of content
- `confluence_addContentWatcher` — Add a watcher to a piece of content
- `confluence_removeContentWatcher` — Remove a watcher from a piece of content

#### Attachments

- `confluence_getAttachments` — Get the attachments on a piece of content
- `confluence_createAttachment` — Upload a new attachment to a piece of content
- `confluence_updateAttachmentMeta` — Update an attachment's metadata (filename, media type, comment)
- `confluence_updateAttachmentData` — Replace the binary data of an attachment, adding a new version
- `confluence_moveAttachment` — Move an attachment to a different content entity, optionally renaming it
- `confluence_removeAttachment` — Remove an attachment from a piece of content
- `confluence_deleteAttachment` — Delete an attachment
- `confluence_deleteAttachmentVersion` — Delete a specific version of an attachment

#### Spaces — search, CRUD, archive/restore

- `confluence_searchSpace` — Search for spaces
- `confluence_getSpace` — Get information about a single space
- `confluence_getSpaces` — List spaces with optional filters
- `confluence_createSpace` — Create a new space
- `confluence_updateSpace` — Update a space's name and description
- `confluence_deleteSpace` — Delete a space
- `confluence_getSpaceContent` — Get the content in a space
- `confluence_archiveSpace` — Archive a space
- `confluence_restoreSpace` — Restore an archived space

#### Space properties

- `confluence_getSpaceProperties` — Get the properties stored on a space
- `confluence_getSpaceProperty` — Get a single space property by key
- `confluence_createSpaceProperty` — Create a space property
- `confluence_updateSpaceProperty` — Update a space property
- `confluence_deleteSpaceProperty` — Delete a space property
