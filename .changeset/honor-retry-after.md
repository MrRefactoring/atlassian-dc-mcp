---
"datacenter-mcp-core": patch
---

Honor the `Retry-After` response header on rate-limited/unavailable responses. The hand-written HTTP client now parses `Retry-After` (delta-seconds or HTTP-date) into `ApiError.retryAfterMs`, and `handleApiOperation` uses it as the wait before the next retry instead of its own exponential backoff when the server provides one. The honored delay is clamped to a new `maxRetryAfterMs` retry option (default 30s) so a large server value can never hang a tool call, and the retry log records whether `Retry-After` was honored. All three products benefit uniformly since they share the core client. A new `parseRetryAfterMs` helper is exported for reuse.
