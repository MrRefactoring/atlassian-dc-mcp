---
"datacenter-mcp-core": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

Roll tool annotations out to Confluence (101 tools) and Bitbucket (114 tools) via the shared `registerAnnotatedTool` helper, so every tool across all three products now advertises `readOnlyHint`/`destructiveHint`/`idempotentHint`/`title`/`openWorldHint`.

The core classifier learned the vocabulary these products use: it skips the `admin_` namespace token so `confluence_admin_delete_user` is correctly flagged destructive, treats `convert`/`compare`/`browse`/`can`/`is` as read-only, and classifies `grant`/`revoke`/`enable`/`disable`/`watch`/`unwatch`/`edit` as idempotent non-destructive writes. Pull-request and version merges are flagged destructive.
