---
"jira-datacenter-mcp": patch
---

Rewrite the internal Jira API client in a hand-written, trello.js-style shape (one function per endpoint, named parameters, resource-grouped namespaces, and a Zod schema per model) in place of the generated OpenAPI client, reusing the shared HTTP client from `datacenter-mcp-core`. No change to the exposed tools or their behavior; the generated static service classes, the mutable `OpenAPI` singleton, `CancelablePromise`, and the `__request` plumbing are gone. Service calls now read as `client.<group>.<verb>({named})` with clean method names (no `search1` / `getProperty3` suffixes), and binary downloads (attachment content, email templates) stream through the client's arraybuffer mode.
