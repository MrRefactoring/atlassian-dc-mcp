---
'datacenter-mcp-core': patch
'jira-datacenter-mcp': patch
'confluence-datacenter-mcp': patch
'bitbucket-datacenter-mcp': patch
---

Escape reserved characters in URL path parameters.

`route`, the tagged template every client builds its paths with, encoded interpolated values with `encodeURI`. That leaves `#`, `?`, `&`, `=`, `+`, `,`, `:`, `;` and `@` untouched, so anything named with one of them produced a URL that meant something else: a repository file called `design #draft?.md` became `/browse/docs/design%20#draft?.md`, where the `#` opens a fragment and the rest of the path never reaches the server. Every endpoint that interpolates a path was affected, across all three products.

Values are now escaped one `/`-separated segment at a time, which keeps separators in file-path parameters like `browse/{path}` while escaping everything else. Callers pass the same values as before.
