# Atlassian Jira Data Center MCP

This package provides a Machine Comprehension Protocol (MCP) server for interacting with Atlassian Jira Data Center edition.

## Interactive Setup

The easiest way to configure this server is the built-in `setup` subcommand:

```bash
npx jira-datacenter-mcp setup
```

It prompts for host, API base path, default page size, and API token, then stores them in the most secure place available:

- **macOS** — token in the login Keychain (service `atlassian-dc-mcp`, account `jira-token`); host / base path / page size in `~/.atlassian-dc-mcp/jira.env` (mode `0600`).
- **Linux** — everything in `~/.atlassian-dc-mcp/jira.env` with POSIX mode `0600` (read/write for your user only).
- **Windows** — everything in `%USERPROFILE%\.atlassian-dc-mcp\jira.env`. Node passes the mode bits but Windows ignores them, so the file inherits the ACL of your user profile directory (typically readable only by your user, SYSTEM, and Administrators).

After setup, you can launch the server without any environment variables:

```json
{
  "mcpServers": {
    "atlassian-jira-dc": {
      "command": "npx",
      "args": ["-y", "jira-datacenter-mcp"]
    }
  }
}
```

Environment variables still override stored values — see [Configuration sources](#configuration-sources) below.

### Scripted / non-interactive setup

For CI, remote sessions, or shell scripts, pass values as flags and add `--non-interactive` to skip prompts:

```bash
npx jira-datacenter-mcp setup --non-interactive \
  --host jira.example.com \
  --token "$JIRA_TOKEN"
```

Available flags: `--host`/`-H`, `--api-base-path`/`-b`, `--token`/`-t`, `--default-page-size`/`-s`, `--non-interactive`/`-n`, `--help`/`-h`. In `--non-interactive` mode, missing values fall back to existing configuration and the run exits non-zero only if a host (or full-URL `--api-base-path`) cannot be resolved. The token is optional — omit it for anonymous access; an existing token is reused when `--token` is omitted. Run `npx jira-datacenter-mcp setup --help` for full usage.

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
    "atlassian-jira-dc": {
      "command": "npx",
      "args": ["-y", "jira-datacenter-mcp"],
      "env": {
        "JIRA_HOST": "your-jira-host",
        "JIRA_API_TOKEN": "your-token"
      }
    }
  }
}
```

To reuse one shared dotenv file across multiple tools or MCP hosts, point the server at an absolute file path:

```json
{
  "mcpServers": {
    "atlassian-jira-dc": {
      "command": "npx",
      "args": ["-y", "jira-datacenter-mcp"],
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
    "atlassian-jira-dc": {
      "command": "npx",
      "args": ["-y", "jira-datacenter-mcp"],
      "env": {
        "ATLASSIAN_DC_MCP_CONFIG_FILE": "C:\\\\Users\\\\your-user\\\\AppData\\\\Roaming\\\\atlassian-dc-mcp.env"
      }
    }
  }
}
```

Note: Set `JIRA_HOST` variable only to domain + port without a protocol (e.g., `your-instance.atlassian.net`). The https protocol is assumed.

Alternatively, you can use `JIRA_API_BASE_PATH` instead of `JIRA_HOST` to specify the complete API base URL including protocol (e.g., `https://your-instance.atlassian.net/rest`). Note that the `/api/2/search/` part is static and added automatically in the code, so you don't need to include it in the `JIRA_API_BASE_PATH` value.

## Features

- Search for issues using JQL (Jira Query Language)
- Get issue details by key
- Get issue comments
- Create and update issues
- Add comments to issues

## Setup

1. Install dependencies:
   ```
   pnpm install
   ```

2. Create a `.env` file in the packages/jira directory, or put the same values in a shared dotenv file and set `ATLASSIAN_DC_MCP_CONFIG_FILE` to its absolute path:
   ```
   JIRA_HOST=your-jira-instance.atlassian.net
   # OR alternatively use
   # JIRA_API_BASE_PATH=https://your-jira-instance.atlassian.net/rest
   # Note: /api/latest/ is added automatically, do not include it
   # Optional: omit for anonymous access if your instance allows unauthenticated reads
   JIRA_API_TOKEN=your-personal-access-token

   # Optional: default page size for paginated read tools (fallback: 25)
   JIRA_DEFAULT_PAGE_SIZE=25
   ```

   See [Configuration sources](#configuration-sources) for the full precedence chain.

   To create a personal access token:
  - In Jira, select your profile picture at the top right
  - Select **Personal Access Tokens**
  - Select **Create token** and give it a name
  - Copy the token and store it securely (you won't be able to see it again)

## Configuration sources

Each key is resolved by walking these sources in priority order and taking the first non-empty value:

| Priority | Source | Reads | Written by `setup` |
|---------:|--------|-------|--------------------|
| 100 | `process.env` (`JIRA_HOST`, `JIRA_API_BASE_PATH`, `JIRA_API_TOKEN`, `JIRA_DEFAULT_PAGE_SIZE`) | all keys | — |
| 80  | env file — `ATLASSIAN_DC_MCP_CONFIG_FILE` (absolute path) or `./.env` | all keys | — |
| 60  | home file — `~/.atlassian-dc-mcp/jira.env` on macOS/Linux, `%USERPROFILE%\.atlassian-dc-mcp\jira.env` on Windows (mode `0600` on POSIX; Windows inherits the user-profile ACL) | all keys | host, apiBasePath, defaultPageSize (always); token (non-darwin or keychain fallback) |
| 40  | macOS Keychain — service `atlassian-dc-mcp`, account `jira-token` | token only | token (darwin only) |

`setup` always writes non-secret fields to the home file and tries the keychain first for the token. If a higher-priority source shadows the value being saved, `setup` prints a warning so you can unset the env var.

## Usage

Start the MCP server:

```
pnpm build
```

Or for development with auto-reload:

```
pnpm dev
```

### Available Tools

This server exposes 208 tools, grouped below by area. Every tool name is prefixed with `jira_`.

#### Issues — core

- `jira_searchIssues` — Search for issues using JQL.
- `jira_getIssue` — Get details of an issue by its key.
- `jira_createIssue` — Create a new issue.
- `jira_updateIssue` — Update an existing issue.
- `jira_deleteIssue` — Delete an issue. This is irreversible.
- `jira_getTransitions` — Get available status transitions for an issue.
- `jira_transitionIssue` — Transition an issue to a new status.
- `jira_getIssueDevelopmentInfo` — Get linked development information (pull requests, commits, or branches) from an issue's Development panel.
- `jira_getCreateIssueMetaIssueTypes` — Get the issue types available for creating an issue in a project.
- `jira_getCreateIssueMetaFields` — Get the required/optional fields for creating an issue of a given type in a project.
- `jira_getEditIssueMeta` — Get the fields available for editing an existing issue.
- `jira_assignIssue` — Assign or unassign an issue via the dedicated assignee endpoint.
- `jira_createIssues` — Create multiple issues in a single bulk request.
- `jira_archiveIssues` — Bulk archive issues by keys or JQL.
- `jira_archiveIssue` — Archive a single issue.
- `jira_rankIssues` — Reorder (rank) issues relative to another issue, as used on Agile boards/backlogs.

#### Issue comments

- `jira_getIssueComments` — Get comments of an issue.
- `jira_postIssueComment` — Post a comment on an issue.
- `jira_updateIssueComment` — Update the text of an existing comment.
- `jira_deleteIssueComment` — Delete a comment. This is irreversible.

#### Issue watchers & votes

- `jira_getIssueWatchers` — Get the list of users watching an issue.
- `jira_addIssueWatcher` — Add a user as a watcher of an issue.
- `jira_removeIssueWatcher` — Remove a user as a watcher of an issue.
- `jira_getIssueVotes` — Get vote information for an issue.
- `jira_addIssueVote` — Cast a vote for an issue as the current user.
- `jira_removeIssueVote` — Remove the current user's vote from an issue.

#### Issue worklogs

- `jira_getIssueWorklogs` — Get all worklog entries of an issue.
- `jira_addIssueWorklog` — Add a worklog entry (time tracking) to an issue.
- `jira_getIssueWorklog` — Get a single worklog entry of an issue.
- `jira_updateIssueWorklog` — Update a worklog entry of an issue.
- `jira_deleteIssueWorklog` — Delete a worklog entry. This is irreversible.

#### Issue attachments

- `jira_addIssueAttachment` — Attach a file to an issue. Provide file content as base64.
- `jira_getAttachmentMeta` — Get attachment capabilities (enabled/disabled, max upload size) of the instance.
- `jira_getAttachment` — Get metadata (including download URI) for an attachment.
- `jira_getAttachmentContent` — Download the raw content of an attachment as base64.
- `jira_deleteAttachment` — Delete an attachment from an issue. This is irreversible.

#### Issue links & link types

- `jira_linkIssues` — Create a link between two issues (e.g., "blocks", "relates to").
- `jira_getIssueLink` — Get details of a link between two issues.
- `jira_deleteIssueLink` — Delete a link between two issues. This is irreversible.
- `jira_getRemoteIssueLinks` — Get the remote issue links (e.g., links to Confluence pages or external URLs) for an issue.
- `jira_getRemoteIssueLink` — Get a single remote issue link by its id.
- `jira_createOrUpdateRemoteIssueLink` — Create a remote issue link on an issue; updates instead of duplicating if globalId matches an existing link.
- `jira_updateRemoteIssueLink` — Update a remote issue link by its id. Any fields not provided are set to null.
- `jira_deleteRemoteIssueLink` — Delete a remote issue link by its id. This is irreversible.
- `jira_deleteRemoteIssueLinkByGlobalId` — Delete a remote issue link by its global id. This is irreversible.
- `jira_getIssueLinkTypes` — Get all issue link types available (e.g., "Blocks", "Relates", "Duplicate").
- `jira_createIssueLinkType` — Create a new issue link type.
- `jira_updateIssueLinkType` — Update an issue link type.
- `jira_deleteIssueLinkType` — Delete an issue link type. This is irreversible.

#### Projects

- `jira_getProjects` — Get all projects visible to the current user.
- `jira_searchProjects` — Search for projects by name or key using the picker-style search.
- `jira_getProject` — Get details of a single project by id or key.
- `jira_validateProjectKey` — Validate a candidate project key before creating a new project.
- `jira_createProject` — Create a new project.
- `jira_updateProject` — Update an existing project. Only non-null values sent are updated.
- `jira_deleteProject` — Delete a project. This is irreversible.
- `jira_archiveProject` — Archive a project.
- `jira_restoreProject` — Restore a previously archived project.

#### Project components

- `jira_getProjectComponents` — Get all components of a project.
- `jira_createComponent` — Create a component in a project.
- `jira_getComponents` — Get a paginated list of components, optionally filtered by project or name query.
- `jira_getComponent` — Get a single component by id.
- `jira_updateComponent` — Update a component.
- `jira_deleteComponent` — Delete a component. This is irreversible.
- `jira_getComponentRelatedIssues` — Get counts of issues related to a component.

#### Project versions

- `jira_getProjectVersions` — Get all versions of a project.
- `jira_createVersion` — Create a version in a project.
- `jira_getVersions` — Get a paginated list of versions, optionally filtered by project or name query.
- `jira_getVersion` — Get a single version by id.
- `jira_updateVersion` — Update a version.
- `jira_deleteAndReplaceVersion` — Delete a version, moving affected/fix-version issues to replacement versions. This is irreversible.
- `jira_mergeVersion` — Merge a version into another version, moving all its issues to the target version. This is irreversible.
- `jira_moveVersion` — Reposition a version within its project's version sequence.
- `jira_getVersionRelatedIssues` — Get counts of issues related to a version.
- `jira_getVersionUnresolvedIssues` — Get the count of unresolved issues for a version.

#### Project categories

- `jira_getProjectCategories` — Get all project categories.
- `jira_createProjectCategory` — Create a new project category.
- `jira_getProjectCategory` — Get a single project category by id.
- `jira_updateProjectCategory` — Update a project category's name or description.
- `jira_deleteProjectCategory` — Delete a project category.

#### Project roles & global role definitions

- `jira_getProjectRoles` — Get the project roles defined for a project.
- `jira_getProjectRole` — Get details (including current actors) for a single project role.
- `jira_setProjectRoleActors` — Replace all actors (users/groups) of a project role.
- `jira_addProjectRoleActors` — Add users and/or groups as actors of a project role, without affecting existing actors.
- `jira_deleteProjectRoleActor` — Remove a single user or group actor from a project role.
- `jira_getRoleDefinitions` — Get all global role definitions (the global role catalog, distinct from project roles).
- `jira_createRoleDefinition` — Create a new global role definition.
- `jira_getRoleDefinition` — Get a single global role definition by id.
- `jira_updateRoleDefinition` — Fully update a global role definition's name and description.
- `jira_partialUpdateRoleDefinition` — Partially update a global role definition's name or description.
- `jira_deleteRoleDefinition` — Delete a global role definition.
- `jira_getRoleDefinitionActors` — Get the default actors for a global role definition.
- `jira_addRoleDefinitionActors` — Add default actors to a global role definition.
- `jira_deleteRoleDefinitionActor` — Remove a default actor from a global role definition.

#### Issue types, priorities, resolutions & statuses

- `jira_getIssueTypes` — Get all issue types available.
- `jira_getPriorities` — Get all issue priorities available.
- `jira_getResolutions` — Get all issue resolutions available.
- `jira_getStatuses` — Get all issue statuses available.

#### Users & groups

- `jira_getUser` — Get details of a single user by username or key.
- `jira_findUsers` — Search for users by free-text query.
- `jira_findAssignableUsers` — Search for users assignable to a project or issue.
- `jira_createUser` — Create a new user.
- `jira_removeUser` — Remove a user and its references.
- `jira_changeUserPassword` — Change a user's password.
- `jira_validateUserAnonymization` — Validate whether a user can be anonymized.
- `jira_scheduleUserAnonymization` — Schedule a user anonymization process. Requires system admin permission.
- `jira_getUserAnonymizationProgress` — Get the progress of a user anonymization task.
- `jira_createGroup` — Create a group.
- `jira_deleteGroup` — Delete a group. This is irreversible.
- `jira_getGroupUsers` — Get the members of a group.
- `jira_addUserToGroup` — Add a user to a group.
- `jira_removeUserFromGroup` — Remove a user from a group.
- `jira_findGroups` — Search for groups by a substring match against group names (group-picker style autocomplete).
- `jira_findUsersAndGroups` — Search for users and groups matching a query, with match highlighting (combined user/group-picker autocomplete).

#### Filters & dashboards

- `jira_createFilter` — Create a saved search filter.
- `jira_getFilter` — Get a saved search filter by id.
- `jira_updateFilter` — Update a saved search filter.
- `jira_deleteFilter` — Delete a saved search filter. This is irreversible.
- `jira_getFavouriteFilters` — Get the current user's favourite saved search filters.
- `jira_getDashboards` — Get a list of dashboards visible to the current user.
- `jira_getDashboard` — Get a single dashboard by id.

#### Agile boards

- `jira_getBoards` — Get Agile boards visible to the current user, optionally filtered by name or project.
- `jira_getBoard` — Get a single Agile board by id.
- `jira_getBoardConfiguration` — Get the configuration (columns, estimation, ranking) of an Agile board.
- `jira_getBoardIssues` — Get the issues on an Agile board, optionally filtered by JQL.
- `jira_getBoardSprints` — Get the sprints of an Agile board.
- `jira_getBoardVersions` — Get the versions of an Agile board's project.
- `jira_getBoardBacklogIssues` — Get the backlog issues of an Agile board.
- `jira_getBoardEpics` — Get the epics of an Agile board.
- `jira_getBoardIssuesWithoutEpic` — Get the issues on an Agile board that are not assigned to any epic.
- `jira_getBoardEpicIssues` — Get the issues assigned to a specific epic on an Agile board.
- `jira_moveIssuesToBacklog` — Move issues to the backlog, removing them from any sprint.

#### Sprints

- `jira_createSprint` — Create a sprint on an Agile board.
- `jira_getSprint` — Get a single sprint by id.
- `jira_updateSprint` — Update a sprint, including starting or closing it via the state field.
- `jira_deleteSprint` — Delete a sprint. This is irreversible.
- `jira_getSprintIssues` — Get the issues in a sprint.
- `jira_moveIssuesToSprint` — Move issues into a sprint.

#### Epics

- `jira_getEpic` — Get a single epic by id or issue key.
- `jira_updateEpic` — Update an epic (name, summary, done status).
- `jira_getEpicIssues` — Get the issues assigned to an epic.
- `jira_moveIssuesToEpic` — Move issues into an epic.
- `jira_rankEpic` — Reorder (rank) an epic relative to another epic.

#### Issue type schemes

- `jira_getIssueTypeSchemes` — Get all issue type schemes visible to the user.
- `jira_createIssueTypeScheme` — Create a new issue type scheme.
- `jira_getIssueTypeScheme` — Get a single issue type scheme by id.
- `jira_updateIssueTypeScheme` — Update an issue type scheme's name, description, or issue types.
- `jira_deleteIssueTypeScheme` — Delete an issue type scheme. Associated projects fall back to the default scheme.
- `jira_getIssueTypeSchemeProjects` — Get the projects associated with an issue type scheme.
- `jira_setIssueTypeSchemeProjects` — Replace the project associations of an issue type scheme.
- `jira_addIssueTypeSchemeProjects` — Add project associations to an issue type scheme.
- `jira_removeIssueTypeSchemeProjects` — Remove all project associations from an issue type scheme.
- `jira_removeIssueTypeSchemeProject` — Remove a single project association from an issue type scheme.

#### Priority schemes

- `jira_getPrioritySchemes` — Get all priority schemes.
- `jira_createPriorityScheme` — Create a new priority scheme.
- `jira_getPriorityScheme` — Get a single priority scheme by id.
- `jira_updatePriorityScheme` — Update a priority scheme's name, description, or priorities.
- `jira_deletePriorityScheme` — Delete a priority scheme. Projects using it fall back to the default priority scheme.

#### Permission schemes & permissions

- `jira_getPermissionSchemes` — Get all permission schemes.
- `jira_getPermissionScheme` — Get a single permission scheme by id.
- `jira_createPermissionScheme` — Create a new permission scheme.
- `jira_updatePermissionScheme` — Update a permission scheme's name, description, or permission grants.
- `jira_deletePermissionScheme` — Delete a permission scheme.
- `jira_getPermissionSchemeGrants` — Get all permission grants of a permission scheme.
- `jira_createPermissionGrant` — Create a permission grant in a permission scheme.
- `jira_deletePermissionGrant` — Delete a permission grant from a permission scheme.
- `jira_getMyPermissions` — Get the permissions the current user has, optionally scoped to a project or issue.
- `jira_getAllPermissions` — Get the full catalog of permission types present in the instance (global, project, and plugin-added).
- `jira_getApplicationRoles` — Get all application roles (e.g. jira-software, jira-servicedesk). Read-only catalog of licensed applications.
- `jira_getApplicationRole` — Get a single application role by key.

#### Workflows & workflow schemes (read-only)

- `jira_getWorkflows` — Get all workflows, or a workflow by name.
- `jira_getWorkflowScheme` — Get a workflow scheme by id.
- `jira_getWorkflowSchemeDefault` — Get the default workflow of a workflow scheme.
- `jira_getWorkflowSchemeIssueTypeMapping` — Get the workflow mapping for a specific issue type in a workflow scheme.
- `jira_getWorkflowSchemeWorkflowMapping` — Get the issue type mappings for a workflow (or all workflows) in a workflow scheme.

#### Notification schemes

- `jira_getNotificationSchemes` — Get a paginated list of notification schemes.
- `jira_getNotificationScheme` — Get full details of a notification scheme by id.

#### Issue security schemes

- `jira_getSecurityLevel` — Get an issue security level by id.
- `jira_getIssueSecuritySchemes` — Get all issue security schemes.
- `jira_getIssueSecurityScheme` — Get an issue security scheme by id.

#### Custom fields

- `jira_getCustomFields` — Get a paginated, filterable list of custom fields.
- `jira_deleteCustomFields` — Delete custom fields in bulk.
- `jira_getCustomFieldOptions` — Get a custom field's options defined in a given context of projects and issue types.
- `jira_getCustomFieldOption` — Get a custom field option by id.
- `jira_createCustomField` — Create a new custom field.

#### Avatars

- `jira_getSystemAvatars` — Get all system avatars of a given type.
- `jira_getAvatars` — Get all avatars (system and custom) for a given type and owner.
- `jira_uploadTemporaryAvatar` — Upload a temporary avatar image. Returns cropping instructions for `jira_createAvatarFromTemporary`.
- `jira_createAvatarFromTemporary` — Finalize a temporary avatar into a real avatar, using the cropping instructions from `jira_uploadTemporaryAvatar`.
- `jira_deleteAvatar` — Delete an avatar by id.

#### JQL helpers

- `jira_getJqlAutocompleteData` — Get the reserved words, visible field names, and function names available for building JQL queries.
- `jira_getJqlFieldAutocomplete` — Get value autocomplete suggestions for a JQL field while building a query.

#### User preferences

- `jira_getMyPreference` — Get a preference value for the current user by key.
- `jira_setMyPreference` — Set a preference value for the current user by key.
- `jira_deleteMyPreference` — Remove a preference value for the current user by key.

#### Screens

- `jira_getAllScreens` — Get a paginated, searchable list of field screens.
- `jira_addFieldToDefaultScreen` — Add a field or custom field to the default screen's default tab.
- `jira_getScreenAvailableFields` — Get fields available to add to a screen (ones not already present on any tab).
- `jira_getScreenTabs` — Get all tabs for a screen.
- `jira_addScreenTab` — Add a new tab to a screen.
- `jira_renameScreenTab` — Rename a tab on a screen.
- `jira_deleteScreenTab` — Delete a tab from a screen. The screen must have at least one tab remaining.
- `jira_moveScreenTab` — Move a tab to a new position on a screen.
- `jira_getScreenTabFields` — Get all fields on a screen tab.
- `jira_addFieldToScreenTab` — Add a field to a screen tab.
- `jira_removeFieldFromScreenTab` — Remove a field from a screen tab.
- `jira_moveScreenTabField` — Move a field's position on a screen tab.
- `jira_updateScreenTabFieldShowWhenEmpty` — Update whether a field on a screen tab shows a 'no value' indicator when empty.
