---
'bitbucket-datacenter-mcp': patch
---

Add `bitbucket_get_pending_review`, a read-only tool that returns the authenticated user's pending draft review comments for a pull request. This lets callers detect drafts that were created before an interrupted review submission and avoid posting duplicate comments when retrying.
