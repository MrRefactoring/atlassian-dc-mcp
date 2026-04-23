# Atlassian Bitbucket Data Center MCP

This package provides a Machine Comprehension Protocol (MCP) server for interacting with Atlassian Bitbucket Data Center edition.

## Interactive Setup

The easiest way to configure this server is the built-in `setup` subcommand:

```bash
npx @atlassian-dc-mcp/bitbucket setup
```

It prompts for host, API base path, default page size, and API token, then stores them in the most secure place available:

- **macOS** — token in the login Keychain (service `atlassian-dc-mcp`, account `bitbucket-token`); host / base path / page size in `~/.atlassian-dc-mcp/bitbucket.env` (mode `0600`).
- **Linux** — everything in `~/.atlassian-dc-mcp/bitbucket.env` with POSIX mode `0600` (read/write for your user only).
- **Windows** — everything in `~/.atlassian-dc-mcp/bitbucket.env`. Node passes the mode bits but Windows ignores them, so the file inherits the ACL of your user profile directory (typically readable only by your user, SYSTEM, and Administrators).

After setup, you can launch the server without any environment variables:

```json
{
  "mcpServers": {
    "atlassian-bitbucket-dc": {
      "command": "npx",
      "args": ["-y", "@atlassian-dc-mcp/bitbucket"]
    }
  }
}
```

Environment variables still override stored values — see [Configuration sources](#configuration-sources) below.

## Claude Desktop Configuration

To use this MCP connector with Claude Desktop, add the following to your Claude Desktop configuration:

macOS:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Windows:
```
%APPDATA%\Claude\claude_desktop_config.json
```

```json
{
  "mcpServers": {
    "atlassian-bitbucket-dc": {
      "command": "npx",
      "args": ["-y", "@atlassian-dc-mcp/bitbucket"],
      "env": {
        "BITBUCKET_HOST": "your-bitbucket-host",
        "BITBUCKET_API_TOKEN": "your-token"
      }
    }
  }
}
```

To reuse one shared dotenv file across multiple tools or MCP hosts, point the server at an absolute file path:

```json
{
  "mcpServers": {
    "atlassian-bitbucket-dc": {
      "command": "npx",
      "args": ["-y", "@atlassian-dc-mcp/bitbucket"],
      "env": {
        "ATLASSIAN_DC_MCP_CONFIG_FILE": "/Users/your-user/.config/atlassian-dc-mcp.env"
      }
    }
  }
}
```

Windows example:

```json
{
  "mcpServers": {
    "atlassian-bitbucket-dc": {
      "command": "npx",
      "args": ["-y", "@atlassian-dc-mcp/bitbucket"],
      "env": {
        "ATLASSIAN_DC_MCP_CONFIG_FILE": "C:\\\\Users\\\\your-user\\\\AppData\\\\Roaming\\\\atlassian-dc-mcp.env"
      }
    }
  }
}
```

Note: Set `BITBUCKET_HOST` variable only to domain + port without protocol (e.g., `your-instance.atlassian.net`). The https protocol is assumed.

Alternatively, you can use `BITBUCKET_API_BASE_PATH` instead of `BITBUCKET_HOST` to specify the complete API base URL including protocol (e.g., `https://your-instance.atlassian.net/rest`). Note that the `/api/latest/` part is static and added automatically in the code, so you don't need to include it in the `BITBUCKET_API_BASE_PATH` value.

## Features

- Access repository information
- Get file contents
- Browse branches and commits
- Get pull request information
- Search and filter repositories

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the packages/bitbucket directory, or put the same values in a shared dotenv file and set `ATLASSIAN_DC_MCP_CONFIG_FILE` to its absolute path:
   ```
   BITBUCKET_HOST=your-bitbucket-instance.atlassian.net
   # OR alternatively use
   # BITBUCKET_API_BASE_PATH=https://your-bitbucket-instance.atlassian.net/rest
   # Note: /api/latest/ is added automatically, do not include it
   BITBUCKET_API_TOKEN=your-personal-access-token

   # Optional: default page size for paginated read tools (fallback: 25)
   BITBUCKET_DEFAULT_PAGE_SIZE=25
   ```

   See [Configuration sources](#configuration-sources) for the full precedence chain.

   To create a personal access token:
  - In Bitbucket, select your profile picture at the bottom left
  - Select **Manage Account** > **HTTP access tokens**
  - Select **Create token** and give it a name
  - Set appropriate permissions for the token
  - Copy the token and store it securely (you won't be able to see it again)

## Configuration sources

Each key is resolved by walking these sources in priority order and taking the first non-empty value:

| Priority | Source | Reads | Written by `setup` |
|---------:|--------|-------|--------------------|
| 100 | `process.env` (`BITBUCKET_HOST`, `BITBUCKET_API_BASE_PATH`, `BITBUCKET_API_TOKEN`, `BITBUCKET_DEFAULT_PAGE_SIZE`) | all keys | — |
| 80  | env file — `ATLASSIAN_DC_MCP_CONFIG_FILE` (absolute path) or `./.env` | all keys | — |
| 60  | home file — `~/.atlassian-dc-mcp/bitbucket.env` (mode `0600` on macOS/Linux; Windows inherits the user-profile ACL) | all keys | host, apiBasePath, defaultPageSize (always); token (non-darwin or keychain fallback) |
| 40  | macOS Keychain — service `atlassian-dc-mcp`, account `bitbucket-token` | token only | token (darwin only) |

`setup` always writes non-secret fields to the home file and tries the keychain first for the token. If a higher-priority source shadows the value being saved, `setup` prints a warning so you can unset the env var.

## Usage

Or for development with auto-reload:

```
npm run dev
```

### Available Tools

#### 1. bitbucket_getRepositories

Get a list of repositories from the Bitbucket Data Center instance.

Parameters:
- `projectKey` (string, optional): Filter repositories by project key
- `limit` (number, optional): Maximum number of results to return
- `start` (number, optional): Starting index for pagination

#### 2. bitbucket_getRepository

Get details of a specific repository from the Bitbucket Data Center instance.

Parameters:
- `projectKey` (string, required): The project key (e.g., "PROJECT")
- `repositorySlug` (string, required): The repository slug (e.g., "repo-name")

#### 3. bitbucket_getBranches

Get branches for a repository from the Bitbucket Data Center instance.

Parameters:
- `projectKey` (string, required): The project key
- `repositorySlug` (string, required): The repository slug
- `filterText` (string, optional): Filter branches by name
- `limit` (number, optional): Maximum number of results to return
- `start` (number, optional): Starting index for pagination

#### 4. bitbucket_getFileContent

Get the content of a file from a repository in the Bitbucket Data Center instance.

Parameters:
- `projectKey` (string, required): The project key
- `repositorySlug` (string, required): The repository slug
- `path` (string, required): Path to the file in the repository
- `at` (string, optional): Commit or branch to get the file from (defaults to main/master branch)

#### 5. bitbucket_getPullRequests

Get pull requests for a repository from the Bitbucket Data Center instance.

Parameters:
- `projectKey` (string, required): The project key
- `repositorySlug` (string, required): The repository slug
- `state` (string, optional): Filter by PR state (OPEN, MERGED, DECLINED)
- `limit` (number, optional): Maximum number of results to return
- `start` (number, optional): Starting index for pagination

#### 6. bitbucket_getDashboardPullRequests

Get pull requests from the Bitbucket dashboard across all repositories. Useful for finding all PRs where you are the author, reviewer, or participant without specifying a project or repository.

Parameters:
- `role` (string, optional): Filter by user's role — AUTHOR (default), REVIEWER, or PARTICIPANT
- `state` (string, optional): Filter by PR state — OPEN (default), DECLINED, or MERGED
- `closedSince` (number, optional): Timestamp in milliseconds. If state is not OPEN, return only PRs closed after this date
- `order` (string, optional): Order of results — NEWEST (default), OLDEST, or PARTICIPANT
- `limit` (number, optional): Maximum number of results to return. Defaults to `BITBUCKET_DEFAULT_PAGE_SIZE` or `25`.
- `start` (number, optional): Starting index for pagination

## Response Shaping

- Paginated read tools use `BITBUCKET_DEFAULT_PAGE_SIZE` when `limit` is omitted.
- `bitbucket_getPR_CommentsAndAction` and `bitbucket_getPullRequestChanges` support `output=summary|compact|full`. The default is `compact`.
- `bitbucket_postPullRequestComment`, `bitbucket_createPullRequest`, and `bitbucket_updatePullRequest` support `output=ack|full`. The default is `ack`.
