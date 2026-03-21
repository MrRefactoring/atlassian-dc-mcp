# Atlassian Jira Data Center MCP

This package provides a Machine Comprehension Protocol (MCP) server for interacting with Atlassian Jira Data Center edition.

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
      "args": ["-y", "@atlassian-dc-mcp/jira"],
      "env": {
        "JIRA_HOST": "your-jira-host",
        "JIRA_API_TOKEN": "your-token"
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
   npm install
   ```

2. Create a `.env` file in the packages/jira directory with the following variables:
   ```
   JIRA_HOST=your-jira-instance.atlassian.net
   # OR alternatively use
   # JIRA_API_BASE_PATH=https://your-jira-instance.atlassian.net/rest
   # Note: /api/latest/ is added automatically, do not include it
   JIRA_API_TOKEN=your-personal-access-token

   # Optional: default page size for paginated read tools (fallback: 25)
   JIRA_DEFAULT_PAGE_SIZE=25
   ```

   To create a personal access token:
  - In Jira, select your profile picture at the top right
  - Select **Personal Access Tokens**
  - Select **Create token** and give it a name
  - Copy the token and store it securely (you won't be able to see it again)

## Usage

Start the MCP server:

```
npm run build
```

Or for development with auto-reload:

```
npm run dev
```

### Available Tools

#### 1. jira_searchIssues

Search for JIRA issues using JQL in the JIRA Data Center edition instance.

Parameters:
- `jql` (string, required): JIRA Query Language search string
- `expand` (array, optional): Additional response sections to expand, such as `renderedFields`, `names`, or `schema`
- `startAt` (number, optional): Starting index for pagination
- `maxResults` (number, optional): Maximum number of results to return. Defaults to `JIRA_DEFAULT_PAGE_SIZE` or `25`.
- `fields` (array, optional): Issue field names to return. When omitted, the tool uses a moderate-detail default field set.

#### 2. jira_getIssue

Get details of a JIRA issue by its key from the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `expand` (string, optional): Comma-separated response sections to expand, such as `renderedFields`, `changelog`, or `transitions`
- `fields` (array, optional): Issue field names to return. When omitted, the tool uses the search default field set plus `parent` and `subtasks`.

#### 3. jira_getIssueComments

Get comments for a JIRA issue from the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `expand` (string, optional): Comma-separated comment expansions, such as `renderedBody`
- `maxResults` (number, optional): Maximum number of comments to return. Defaults to `JIRA_DEFAULT_PAGE_SIZE` or `25`.
- `startAt` (number, optional): Starting comment offset for pagination

#### 4. jira_createIssue

Create a new issue in the JIRA Data Center edition instance.

Parameters:
- `projectId` (string, required): Project key (despite the parameter name, e.g., "PROJ")
- `summary` (string, required): Issue summary
- `description` (string, required): Issue description in format suitable for JIRA Data Center edition (JIRA Wiki Markup)
- `issueTypeId` (string, required): ID of the issue type
- `customFields` (object, optional): Additional JIRA fields merged into the issue payload. Can be used for custom fields and standard fields such as `labels`. Example: `{"labels":["urgent","bug"],"customfield_10001":"Custom Value"}`

#### 5. jira_updateIssue

Update an existing issue in the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `summary` (string, optional): New issue summary
- `description` (string, optional): New issue description in format suitable for JIRA Data Center edition (JIRA Wiki Markup)
- `issueTypeId` (string, optional): New issue type ID
- `customFields` (object, optional): Additional JIRA fields merged into the update payload. Can be used for custom fields and standard fields such as `labels`. Example: `{"labels":["urgent","bug"],"customfield_10001":"Custom Value"}`

#### 6. jira_postIssueComment

Add a comment to a JIRA issue in the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `comment` (string, required): Comment text in format suitable for JIRA Data Center edition (JIRA Wiki Markup)

#### 7. jira_getTransitions

Get the available workflow transitions for a JIRA issue in the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")

#### 8. jira_transitionIssue

Transition a JIRA issue to a new status in the JIRA Data Center edition instance.

Parameters:
- `issueKey` (string, required): The issue key (e.g., "PROJECT-123")
- `transitionId` (string, required): Transition ID returned by `jira_getTransitions`
- `fields` (object, optional): Additional fields required by the transition screen
