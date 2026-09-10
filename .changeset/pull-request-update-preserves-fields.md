---
'bitbucket-datacenter-mcp': minor
---

Stop dropping reviewers when a pull request is updated.

`PUT /pull-requests/{id}` in Bitbucket Data Center replaces the pull request with the body it receives instead of patching it, so a body of `{version, description}` tells the server that the pull request should have no reviewers at all. Editing a description through `bitbucket_update_pull_request` removed every reviewer from the pull request. Atlassian closed this as expected behaviour in BSERV-19139 and pointed at reading the pull request before writing it.

`bitbucket_update_pull_request` now does exactly that: it reads the pull request and sends back its title, description, draft flag and reviewers, overriding only the fields the caller passed. Passing `reviewers` still replaces the whole list, and an empty array now clears it.

`version` became optional as a result. Pass it to keep the optimistic locking that fails the call when someone else changed the pull request in the meantime; omit it to use the version read during the update.
