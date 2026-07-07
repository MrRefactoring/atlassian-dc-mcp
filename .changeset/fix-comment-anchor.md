---
"bitbucket-datacenter-mcp": patch
---

Fix inline pull-request and commit comments silently posting as general (unanchored) comments. The comment client assembles the POST body with `pickBody(params, CommentSchema)`, but `CommentSchema` did not declare `anchor` (file/line attachment) or `parent` (reply reference), so those fields were stripped from the request: an inline comment landed as a top-level PR comment and a reply landed as a new thread. Both fields are now part of `CommentSchema` and reach the server. Added an api-layer regression test that asserts the fields survive body assembly (the existing service-level tests mock the client namespace and could not catch this).
