---
"bitbucket-datacenter-mcp": patch
---

Validate the optional `anchor` field when checking whether a raw API response is a well-formed pull request comment, closing a gap where a malformed anchor could silently produce a broken simplified anchor instead of being rejected.
