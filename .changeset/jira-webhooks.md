---
"jira-datacenter-mcp": minor
---

Add Jira webhook tools: `jira_get_webhooks`, `jira_get_webhook`, `jira_create_webhook` (subscribe a URL to Jira events, optionally filtered by JQL), `jira_update_webhook`, and `jira_delete_webhook`, wrapping the `/rest/webhooks/1.0/` plugin API. Note: unlike the platform REST API, the webhook endpoints do not accept personal access tokens — they require Basic auth (username/password) or a session — so these tools work only when the server is configured with Basic auth. Responses are validated softly (schema mismatches log and pass through rather than failing).
