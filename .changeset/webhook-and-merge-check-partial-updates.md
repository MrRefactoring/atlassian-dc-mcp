---
'bitbucket-datacenter-mcp': minor
---

Stop dropping the webhook secret and the required-builds exemption on update, and send build payloads as JSON.

Bitbucket Data Center treats a `PUT` body as the entity's new state, not as a patch, so every field left out of the body is cleared. Probing a live 9.6.5 instance confirmed three of them:

- `bitbucket_update_webhook` removed the stored HMAC secret whenever it was called without one, so changing a webhook's url silently unsigned every future delivery. The tool now reads the webhook and keeps its name, url, events, active state, SSL setting and secret unless you pass a replacement. An empty secret removes the stored one.
- `bitbucket_update_required_builds_merge_check` removed the exempt ref matcher the same way. It now reads the existing check and keeps the build keys, ref matcher and exemption you leave out, and reports an unknown check id instead of writing.
- `bitbucket_add_build_status`, `bitbucket_add_code_insights_annotations` and both required-builds merge check tools sent their JSON body under `Content-Type: */*`, which Bitbucket answers with `415 Unsupported Media Type`. They now send `application/json`.

Updating a project or a repository was probed as well and needs no change: Bitbucket keeps the fields those endpoints do not receive.
