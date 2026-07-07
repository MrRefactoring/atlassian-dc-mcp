---
"bitbucket-datacenter-mcp": patch
---

Fix `bitbucket_submit_pull_request_review` not publishing the reviewer's pending (draft) comments. It called the participant-status endpoint (`PUT .../participants/{userSlug}`), which only sets an approval status and leaves draft comments unpublished — so a review was recorded but the pending comments (including inline/file comments) never appeared. It now calls the correct `PUT .../pull-requests/{id}/review` (finishReview) endpoint, which acts as the authenticated user (the PAT owner) and atomically publishes their pending comments while setting the status. The `userSlug` argument is no longer required (the review is always submitted as the token owner) and an optional `commentText` summary is now supported. Verified live against Bitbucket DC 9.3.
