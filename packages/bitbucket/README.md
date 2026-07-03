# Atlassian Bitbucket Data Center MCP

This package provides a Machine Comprehension Protocol (MCP) server for interacting with Atlassian Bitbucket Data Center edition.

## Interactive Setup

The easiest way to configure this server is the built-in `setup` subcommand:

```bash
npx bitbucket-datacenter-mcp setup
```

It prompts for host, API base path, default page size, and API token, then stores them in the most secure place available:

- **macOS** — token in the login Keychain (service `atlassian-dc-mcp`, account `bitbucket-token`); host / base path / page size in `~/.atlassian-dc-mcp/bitbucket.env` (mode `0600`).
- **Linux** — everything in `~/.atlassian-dc-mcp/bitbucket.env` with POSIX mode `0600` (read/write for your user only).
- **Windows** — everything in `%USERPROFILE%\.atlassian-dc-mcp\bitbucket.env`. Node passes the mode bits but Windows ignores them, so the file inherits the ACL of your user profile directory (typically readable only by your user, SYSTEM, and Administrators).

After setup, you can launch the server without any environment variables:

```json
{
  "mcpServers": {
    "atlassian-bitbucket-dc": {
      "command": "npx",
      "args": ["-y", "bitbucket-datacenter-mcp"]
    }
  }
}
```

Environment variables still override stored values — see [Configuration sources](#configuration-sources) below.

### Scripted / non-interactive setup

For CI, remote sessions, or shell scripts, pass values as flags and add `--non-interactive` to skip prompts:

```bash
npx bitbucket-datacenter-mcp setup --non-interactive \
  --host bitbucket.example.com \
  --token "$BITBUCKET_TOKEN"
```

Available flags: `--host`/`-H`, `--api-base-path`/`-b`, `--token`/`-t`, `--default-page-size`/`-s`, `--non-interactive`/`-n`, `--help`/`-h`. In `--non-interactive` mode, missing values fall back to existing configuration and the run exits non-zero only if a host (or full-URL `--api-base-path`) cannot be resolved. The token is optional — omit it for anonymous access; an existing token is reused when `--token` is omitted. Run `npx bitbucket-datacenter-mcp setup --help` for full usage.

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
      "args": ["-y", "bitbucket-datacenter-mcp"],
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
      "args": ["-y", "bitbucket-datacenter-mcp"],
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
      "args": ["-y", "bitbucket-datacenter-mcp"],
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
   pnpm install
   ```

2. Create a `.env` file in the packages/bitbucket directory, or put the same values in a shared dotenv file and set `ATLASSIAN_DC_MCP_CONFIG_FILE` to its absolute path:
   ```
   BITBUCKET_HOST=your-bitbucket-instance.atlassian.net
   # OR alternatively use
   # BITBUCKET_API_BASE_PATH=https://your-bitbucket-instance.atlassian.net/rest
   # Note: /api/latest/ is added automatically, do not include it
   # Optional: omit for anonymous access if your instance allows unauthenticated reads
   BITBUCKET_API_TOKEN=your-personal-access-token

   # Alternative to BITBUCKET_API_TOKEN: Basic auth with username + password (e.g. for
   # older instances without personal access tokens). If both are set, Basic auth
   # takes precedence over the Bearer token.
   # BITBUCKET_USERNAME=your-username
   # BITBUCKET_PASSWORD=your-password

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
| 100 | `process.env` (`BITBUCKET_HOST`, `BITBUCKET_API_BASE_PATH`, `BITBUCKET_API_TOKEN`, `BITBUCKET_USERNAME`, `BITBUCKET_PASSWORD`, `BITBUCKET_DEFAULT_PAGE_SIZE`) | all keys | — |
| 80  | env file — `ATLASSIAN_DC_MCP_CONFIG_FILE` (absolute path) or `./.env` | all keys | — |
| 60  | home file — `~/.atlassian-dc-mcp/bitbucket.env` on macOS/Linux, `%USERPROFILE%\.atlassian-dc-mcp\bitbucket.env` on Windows (mode `0600` on POSIX; Windows inherits the user-profile ACL) | all keys | host, apiBasePath, username, defaultPageSize (always); token, password (non-darwin or keychain fallback) |
| 40  | macOS Keychain — service `atlassian-dc-mcp`, accounts `bitbucket-token` / `bitbucket-password` | token, password | token, password (darwin only) |

`setup` always writes non-secret fields (including username) to the home file and tries the keychain first for the token and password. Basic auth (username/password) takes precedence over the Bearer token when both are configured. If a higher-priority source shadows the value being saved, `setup` prints a warning so you can unset the env var.

## Usage

Or for development with auto-reload:

```
pnpm dev
```

### Resources

- `bitbucket://repo/{projectKey}/{repositorySlug}` — a repository, the same data as `bitbucket_getRepository` (e.g. `bitbucket://repo/PROJ/my-repo`).
- `bitbucket://pr/{projectKey}/{repositorySlug}/{pullRequestId}` — a pull request, the same data as `bitbucket_getPullRequest` (e.g. `bitbucket://pr/PROJ/my-repo/42`).

### Prompts

- `bitbucket_reviewPullRequest` (`projectKey`, `repositorySlug`, `pullRequestId`) — guides a structured code review of a pull request: read the diff and existing comments, then produce a review with actionable, anchored comments.

### Available Tools

This server registers 107 tools, grouped below by area.

#### Projects & Repositories

- `bitbucket_getProjects` — Get a list of Bitbucket projects.
- `bitbucket_getProject` — Get a specific Bitbucket project by key.
- `bitbucket_createProject` — Create a new Bitbucket project (requires `PROJECT_CREATE`).
- `bitbucket_updateProject` — Update an existing project's name or description (requires `PROJECT_ADMIN`).
- `bitbucket_deleteProject` — Delete a Bitbucket project (requires `PROJECT_ADMIN`; must have no repositories).
- `bitbucket_getRepositories` — Get repositories for a Bitbucket project.
- `bitbucket_getRepository` — Get a specific Bitbucket repository.
- `bitbucket_createRepository` — Create a new repository in a project (requires `REPO_CREATE`).
- `bitbucket_updateRepository` — Rename a repository or change its description, default branch, or project (requires `REPO_ADMIN`).
- `bitbucket_deleteRepository` — Schedule a repository for deletion (requires `REPO_ADMIN`; irreversible).
- `bitbucket_forkRepository` — Fork an existing repository into another (or the user's personal) project.
- `bitbucket_getRepositoryForks` — List the direct forks of a repository (one level deep only).
- `bitbucket_browseRepository` — Browse a repository path: list a directory, read a file's content, or fetch blame.
- `bitbucket_getFileContent` — Get the raw text content of a file at a given ref or commit.
- `bitbucket_editFile` — Create or edit a file and commit the change in one call, with optimistic conflict detection.
- `bitbucket_searchCode` — Search code across Bitbucket using `project:`/`repo:`/`ext:` modifiers.

#### Branches & Tags

- `bitbucket_getBranches` — Get branches for a repository, with filtering and ordering.
- `bitbucket_createBranch` — Create a branch from a given start point (ref or commit).
- `bitbucket_deleteBranch` — Delete a branch (supports `dryRun` validation).
- `bitbucket_getDefaultBranch` — Get the default branch of a repository.
- `bitbucket_setDefaultBranch` — Set the default branch of a repository from a full ref ID, e.g. `refs/heads/main` (requires `REPO_ADMIN`).
- `bitbucket_getTags` — Get tags for a repository, with filtering and ordering.
- `bitbucket_getTag` — Get a single tag by name.
- `bitbucket_createTag` — Create a (optionally annotated) tag pointing at a ref or commit.
- `bitbucket_getBranchRestrictions` — List branch (ref) restrictions configured on a repository (requires `REPO_ADMIN`).
- `bitbucket_getBranchRestriction` — Get a single branch restriction by ID (requires `REPO_ADMIN`).
- `bitbucket_createBranchRestriction` — Create a branch restriction, with optional user/group/access-key exemptions (requires `REPO_ADMIN`).
- `bitbucket_deleteBranchRestriction` — Delete a branch restriction by ID (requires `REPO_ADMIN`).
- `bitbucket_getRequiredBuildsMergeChecks` — List required-builds merge checks configured on a repository.
- `bitbucket_createRequiredBuildsMergeCheck` — Create a required-builds merge check for a target ref matcher (requires `REPO_ADMIN`).
- `bitbucket_updateRequiredBuildsMergeCheck` — Replace a required-builds merge check's build keys and matcher (requires `REPO_ADMIN`).
- `bitbucket_deleteRequiredBuildsMergeCheck` — Delete a required-builds merge check by ID (requires `REPO_ADMIN`).
- `bitbucket_getDefaultReviewerConditions` — List default reviewer conditions (source/target matcher → reviewers + required approvals).
- `bitbucket_createDefaultReviewerCondition` — Create a default reviewer condition with source/target matchers and reviewer IDs.
- `bitbucket_updateDefaultReviewerCondition` — Replace a default reviewer condition's matchers and reviewer set.
- `bitbucket_deleteDefaultReviewerCondition` — Delete a default reviewer condition by ID.

#### Branch Model

- `bitbucket_getBranchModel` — Get the branch model configuration: development/production branches and the bugfix/feature/hotfix/release prefix settings.
- `bitbucket_setBranchModel` — Replace the branch model configuration; `development` is required, `production`/`types` fall back to server defaults (requires `REPO_ADMIN`).
- `bitbucket_deleteBranchModel` — Reset the branch model configuration to server defaults (requires `REPO_ADMIN`).

#### Commits & Diffs

- `bitbucket_getCommits` — Get commits for a repository.
- `bitbucket_getCommit` — Get a single commit by ID, with author, message, parents, and timestamps.
- `bitbucket_getCommitDiff` — Get the diff of a single commit, optionally scoped to one file.
- `bitbucket_compareRefs` — Compare two refs/commits — list commits between them or the changed files.
- `bitbucket_getCommitComments` — Get comments on a commit, scoped to a file path.
- `bitbucket_addCommitComment` — Add a comment to a commit, optionally anchored to a file/line.

#### Builds & Code Insights

- `bitbucket_listBuildStatuses` — List build statuses (CI results) for a commit (keyed globally, no project/repo needed).
- `bitbucket_addBuildStatus` — Add or update a build status (`SUCCESSFUL`/`FAILED`/`INPROGRESS`) on a commit.
- `bitbucket_getBuildStatus` — Get a single build status for a commit by its key.
- `bitbucket_setInsightReport` — Create or replace a Code Insights report on a commit (e.g. linter/scanner results).
- `bitbucket_getInsightReport` — Get a Code Insights report on a commit by its key.
- `bitbucket_deleteInsightReport` — Delete a Code Insights report (and its annotations) on a commit.
- `bitbucket_addInsightAnnotations` — Add per-file/line annotations to an existing Code Insights report.
- `bitbucket_getInsightAnnotations` — Get the annotations of a Code Insights report on a commit.
- `bitbucket_deleteInsightAnnotations` — Delete one or all annotations of a Code Insights report.

#### Pull Requests

- `bitbucket_getPullRequests` — Get pull requests for a repository.
- `bitbucket_getPullRequest` — Get a specific pull request by ID, including reviewers, state, and version.
- `bitbucket_createPullRequest` — Create a new pull request.
- `bitbucket_updatePullRequest` — Update a PR's title, description, reviewers, target branch, or draft status (requires version).
- `bitbucket_getPullRequestChanges` — Get the changed files for a pull request.
- `bitbucket_getPullRequestDiff` — Get the text diff for a specific file in a pull request.
- `bitbucket_canMergePullRequest` — Check whether a PR can be merged (vetoes, conflicts) as a read-only guard.
- `bitbucket_mergePullRequest` — Merge a pull request (requires version; optional merge message/strategy).
- `bitbucket_declinePullRequest` — Decline an open pull request without merging (requires version).
- `bitbucket_reopenPullRequest` — Reopen a previously declined pull request (requires version).
- `bitbucket_getRequiredReviewers` — Get required reviewers for pull requests from a given source ref to a target ref.
- `bitbucket_addPullRequestReviewer` — Add a single reviewer to a pull request without replacing existing reviewers.
- `bitbucket_removePullRequestReviewer` — Remove a reviewer from a pull request (remains a participant).
- `bitbucket_submitPullRequestReview` — Publish all pending (draft) comments and set the reviewer's verdict.
- `bitbucket_watchPullRequest` — Start watching a pull request for notifications.
- `bitbucket_unwatchPullRequest` — Stop watching a pull request.

#### Pull Request Comments

- `bitbucket_getPR_CommentsAndAction` — Get comments for a pull request and other actions like approvals.
- `bitbucket_postPullRequestComment` — Post a comment to a pull request, including pending/draft, multiline anchors, and BLOCKER tasks.
- `bitbucket_updatePullRequestComment` — Edit a comment's text/severity, or resolve/reopen it (and BLOCKER tasks) via state.
- `bitbucket_deletePullRequestComment` — Delete a comment from a pull request (requires version; fails if it has replies).
- `bitbucket_applyPullRequestSuggestion` — Apply a code suggestion from a PR comment directly to the source branch as a commit.

#### Webhooks

- `bitbucket_getWebhooks` — List webhooks configured on a repository (requires `REPO_ADMIN`).
- `bitbucket_getWebhook` — Get a single webhook by ID (requires `REPO_ADMIN`).
- `bitbucket_createWebhook` — Create a webhook subscribed to one or more events (requires `REPO_ADMIN`).
- `bitbucket_updateWebhook` — Replace an existing webhook's configuration (requires `REPO_ADMIN`).
- `bitbucket_deleteWebhook` — Delete a webhook by ID (requires `REPO_ADMIN`).

#### Repository Settings & Hooks

- `bitbucket_getPullRequestSettings` — Get a repository's pull request settings: merge strategy configuration and merge checks (required approvers/tasks/builds).
- `bitbucket_updatePullRequestSettings` — Update a repository's pull request settings; only the provided keys are changed (requires `REPO_ADMIN`).
- `bitbucket_getRepoHooks` — List a repository's hooks (pre-receive/post-receive) with their enabled state (requires `REPO_ADMIN`).
- `bitbucket_enableRepoHook` — Enable a repository hook by its hook key (requires `REPO_ADMIN`).
- `bitbucket_disableRepoHook` — Disable a repository hook by its hook key (requires `REPO_ADMIN`).
- `bitbucket_getRepoHookSettings` — Get the settings document for a repository hook; the shape is decided by the hook's plugin (requires `REPO_ADMIN`).
- `bitbucket_setRepoHookSettings` — Update the settings document for a repository hook, limited to 32KB serialized (requires `REPO_ADMIN`).

#### Dashboard & Inbox

- `bitbucket_getInboxPullRequests` — Get pull requests from the authenticated user's inbox needing review.
- `bitbucket_getDashboardPullRequests` — Get pull requests from the dashboard across all repositories (by role/state).

#### Users

- `bitbucket_getUser` — Get a user by slug, or search users by name/email to resolve their slug.

#### Access Tokens (PAT)

- `bitbucket_getAccessTokens` — Get HTTP access tokens (PATs) for a user, project, or repository (`scope: user|project|repo`).
- `bitbucket_createAccessToken` — Create an HTTP access token for a user, project, or repository; the raw token value is only returned once.
- `bitbucket_deleteAccessToken` — Delete an HTTP access token by ID from a user, project, or repository.

#### SSH & GPG Keys

- `bitbucket_getSshKeys` — List SSH keys for a user (defaults to the authenticated user; other users require `ADMIN`).
- `bitbucket_addSshKey` — Add an SSH public key for a user (defaults to the authenticated user; other users require `ADMIN`).
- `bitbucket_deleteSshKey` — Delete an SSH key by its ID (requires `ADMIN`).
- `bitbucket_getGpgKeys` — List GPG keys for a user (defaults to the authenticated user; other users require `ADMIN`).
- `bitbucket_addGpgKey` — Add an ASCII-armored GPG public key for a user (defaults to the authenticated user; other users require `ADMIN`).
- `bitbucket_deleteGpgKey` — Delete a GPG key by its ID or fingerprint.

#### Permissions

- `bitbucket_getProjectPermissions` — Get the users/groups granted a permission on a project, with their highest level (requires `PROJECT_ADMIN` or higher).
- `bitbucket_setProjectUserPermission` — Grant or change a user's project permission (`PROJECT_READ`/`PROJECT_WRITE`/`PROJECT_ADMIN`).
- `bitbucket_setProjectGroupPermission` — Grant or change a group's project permission (`PROJECT_READ`/`PROJECT_WRITE`/`PROJECT_ADMIN`).
- `bitbucket_revokeProjectPermission` — Revoke a user's and/or a group's permissions on a project (requires `PROJECT_ADMIN` or higher).
- `bitbucket_getRepoPermissions` — Get the users/groups granted a permission on a repository, with their highest level (requires `REPO_ADMIN` or higher project/global permission).
- `bitbucket_setRepoUserPermission` — Grant or change a user's repository permission (`REPO_READ`/`REPO_WRITE`/`REPO_ADMIN`).
- `bitbucket_setRepoGroupPermission` — Grant or change a group's repository permission (`REPO_READ`/`REPO_WRITE`/`REPO_ADMIN`).
- `bitbucket_revokeRepoPermission` — Revoke a user's and/or a group's permissions on a repository (requires `REPO_ADMIN` or higher project/global permission).

## Response Shaping

- Paginated read tools use `BITBUCKET_DEFAULT_PAGE_SIZE` when `limit` is omitted.
- `bitbucket_getPR_CommentsAndAction` and `bitbucket_getPullRequestChanges` support `output=summary|compact|full`. The default is `compact`.
- `bitbucket_postPullRequestComment`, `bitbucket_createPullRequest`, and `bitbucket_updatePullRequest` support `output=ack|full`. The default is `ack`.
