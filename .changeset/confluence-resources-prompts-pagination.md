---
"confluence-datacenter-mcp": minor
---

Bring Confluence up to the same MCP maturity as Jira with richer resources, prompts, and opt-in pagination:

- **Resources 1 → 4**: added `confluence://space/{spaceKey}`, `confluence://space/{spaceKey}/content`, and `confluence://user/{username}` alongside the existing `confluence://page/{pageId}`.
- **Prompts 1 → 4**: added `confluence_summarize_space`, `confluence_draft_page`, and `confluence_review_space_access` alongside `confluence_build_cql_query` (each references real Confluence tool names).
- **Opt-in pagination**: `confluence_get_spaces`, `confluence_get_attachments`, and `confluence_get_groups` accept `fetchAll` to follow the collection's `_links.next` pagination and return every page as a single flat array (safety-capped). Multi-page following was live-verified against a Confluence Data Center 9.2.21 instance. Type-grouped listings (space content, content children) stay single-page since they are not flat collections; open-ended CQL search stays single-page by design.
