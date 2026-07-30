---
'datacenter-mcp-core': minor
'confluence-datacenter-mcp': minor
'jira-datacenter-mcp': minor
'bitbucket-datacenter-mcp': minor
---

Add binary asset downloads across all three servers, with a shared delivery contract.

Every download tool takes an optional absolute `outputPath`: with it the file is written to disk and only its metadata is returned, so file size is irrelevant. Without it the bytes come back as their own MCP content block — an `image` for raster images, a base64 `resource` blob otherwise — which bypasses the response cap that used to corrupt them. A file above `ATLASSIAN_DC_MCP_MAX_INLINE_BYTES` (default 1 MiB) is refused with a pointer to `outputPath` instead of being silently truncated.

**Confluence** — attachments could be listed, uploaded and replaced but never read back; there was no way to get a page's assets at all. Three new tools:

- `confluence_download_attachment` — one attachment's bytes, identified by id or exact file name.
- `confluence_download_page_attachments` — every attachment on a piece of content into a directory, optionally filtered by media-type prefix or exact file names, capped at 50 files with the remainder reported as skipped. A per-file failure is reported without aborting the rest.
- `confluence_download_page_images` — the images a page actually displays, resolved from `<ac:image>` in its storage-format body (following `<ri:page>` to an image attached to another page). External `<ri:url>` images are listed rather than fetched.

**Bitbucket** — `bitbucket_download_file` reads a repository file as bytes. `bitbucket_get_file_content` hits the same endpoint through the client's text path, which corrupts anything that is not UTF-8; its description now points at the new tool for binary files.

**Jira** — `jira_get_attachment_content` gains `outputPath` and now fetches the download URL with the client's credentials, configured request timeout and `ApiError` contract instead of a hand-rolled `fetch` that only spoke Bearer auth. **Breaking:** the response no longer carries `data.contentBase64`; the bytes arrive as a content block, or `data.savedTo` names the written file.
