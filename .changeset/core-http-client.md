---
"datacenter-mcp-core": minor
"bitbucket-datacenter-mcp": patch
---

Lift the HTTP client core into `datacenter-mcp-core` so every product package shares one implementation. `createHttpClient`, the `route` tagged-template URL builder, `pickBody`, `bindGroup`, `ApiError`, and the client interfaces (`HttpClient`, `SendRequestOptions`, `HttpClientConfig`, …) now live in and are exported from core; a new `responseType: 'arraybuffer'` mode returns the raw bytes for binary downloads. The Bitbucket client drops its local copies and imports these from core, with no change to its behavior or exposed tools.
