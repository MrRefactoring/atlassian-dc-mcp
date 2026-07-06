---
"datacenter-mcp-core": minor
"jira-datacenter-mcp": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

Add two MCP protocol maturity features across all three products:

- **Server `instructions`**: each server now advertises an `instructions` string in its `initialize` result, telling the client/model what the server is, that every call acts as the single configured user, the `<product>_<verb>_<noun>` naming and read/write/destructive annotations, how to search (JQL/CQL), the `fetchAll` pagination opt-in, and the addressable resource URIs. `createMcpServer` gained an optional `instructions` field.
- **Argument completions (`completion/complete`)**: prompt arguments and resource-template variables now offer live autocompletion, backed by list endpoints and filtered against the partial input (case-insensitive substring, capped). Confluence completes `spaceKey`; Jira completes `projectKey` and `boardId`; Bitbucket completes `projectKey` and (scoped to the chosen project) `repositorySlug`. A shared `filterCompletions` helper was added to core. Completions never throw — a failed lookup yields an empty list. Verified live against Confluence Data Center 9.2.21 and Bitbucket Data Center 9.3.2 instances.
