---
'bitbucket-datacenter-mcp': minor
---

Paginate `bitbucket_browse_repository` with `start` and `limit`.

`/browse` returns both a directory's children and a file's lines as a page, with `isLastPage` and `nextPageStart` to continue from. The tool sent neither `start` nor `limit`, so whatever the server chose as its default page was all you ever got: a directory with more entries than that was silently cut off, and nothing in the tool could reach the rest. For files the gap was survivable, since `bitbucket_get_file_content` reads the whole file raw, but a large directory had no way out at all.

Both parameters are optional. `limit` defaults to the package page size, matching the other paginated tools; `start` takes the `nextPageStart` of the previous response, which sits under `children` for a directory and at the response root for a file.
