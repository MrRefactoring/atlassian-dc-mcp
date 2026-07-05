---
"bitbucket-datacenter-mcp": patch
---

Rewrite the internal Bitbucket API client in a hand-written, trello.js-style shape (one function per endpoint, named parameters, resource-grouped namespaces, and a Zod schema per model) in place of the generated OpenAPI client. No change to the exposed tools or their behavior; the generated static service classes, the mutable `OpenAPI` singleton, and `CancelablePromise` plumbing are gone, and response bodies are now runtime-validated against Zod schemas derived from real Bitbucket Data Center responses.
