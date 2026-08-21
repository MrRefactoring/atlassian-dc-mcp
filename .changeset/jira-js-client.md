---
"jira-datacenter-mcp": minor
---

Replace the Jira client with jira.js.

The 206 files under `src/jiraClient/` were OpenAPI-generator output from Atlassian's Data Center specification, committed once and never regenerated. They are gone. Jira now talks through [jira.js](https://github.com/MrRefactoring/jira.js), whose `jira.js/server` surface is generated from the same document — but kept current, and exercised endpoint by endpoint against a live Data Center instance, which is how a specification stops being a guess about what the API returns.

**The webhook tools work again.** All five of them called `/rest/webhooks/1.0/webhook`, a path that served Jira 9 and answers 404 on every 10.x instance — so `jira_list_webhooks`, `jira_get_webhook`, `jira_create_webhook`, `jira_update_webhook` and `jira_delete_webhook` have been failing on any supported version. They now use `/rest/jira-webhook/1.0/webhooks`. `jira_update_webhook` also stops wiping the fields you did not name: Jira replaces the whole registration on a PUT, so the current one is read first and your change laid over it.

Nothing else about the tools changed — same names, same inputs, same shaped responses. Behind them:

- **Responses are validated.** Every response is parsed against a schema. A mismatch is logged and the body handed back unchanged, never rejected, so a wrong schema costs a warning rather than an answer.
- **Credentials are still read per request.** jira.js takes its credentials once; a client is rebuilt whenever the configured ones change, so a token rotated in the shared config file takes effect without restarting the server, exactly as before.
- **Errors keep their shape.** jira.js raises the same `{status, statusText, body}` that `handleApiOperation` retries 429s and 5xx on, with `retryAfterMs` where the server sent one.

No tool was withdrawn. `jira_request_cluster_node_index_snapshot` calls an endpoint Atlassian marks deprecated and plans to remove in Jira 11, which jira.js therefore does not generate; it keeps its own request until the tool goes with it.
