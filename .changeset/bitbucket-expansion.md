---
"bitbucket-datacenter-mcp": minor
---

Expand the Bitbucket MCP surface (all additions live-verified against a Bitbucket Data Center 9.3.2 instance):

- **5 new read tools**: `bitbucket_get_commit_changes` (files changed in a commit), `bitbucket_get_commit_pull_requests` (PRs containing a commit), `bitbucket_get_compare_diff` (raw diff between two refs), `bitbucket_get_repository_labels`, and `bitbucket_get_pull_request_blocker_comments` (a PR's unresolved tasks).
- **2 new resources**: `bitbucket://project/{key}` and `bitbucket://commit/{key}/{slug}/{commitId}`, alongside the existing repo and pull-request resources.
- **3 new prompts**: `bitbucket_triage_open_pull_requests`, `bitbucket_investigate_merge_readiness`, and `bitbucket_prepare_pull_request`, alongside the existing review prompt.
- **Opt-in pagination**: `bitbucket_get_branches` and `bitbucket_get_tags` accept `fetchAll` to follow pagination and return every page as a flat array (safety-capped). Commit and pull-request listings stay single-page.
