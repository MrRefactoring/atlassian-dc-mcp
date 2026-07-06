---
"confluence-datacenter-mcp": minor
---

Expand the Confluence MCP API coverage with 11 new tools (all live-verified against a Confluence Data Center 9.2.21 instance):

- **Label discovery** (6): `confluence_get_recently_used_labels` and `confluence_get_related_labels` (instance-wide), plus `confluence_get_space_labels`, `confluence_get_space_popular_labels`, `confluence_get_space_recent_labels`, and `confluence_get_space_related_labels` (per-space).
- **Space watchers**: `confluence_get_space_watchers` lists the users watching a space.
- **Admin reads** (3): `confluence_get_access_mode_status` (READ_WRITE / READ_ONLY), `confluence_get_audit_records` (audit log), and `confluence_get_global_permissions` (global permission grants).
- **Content cleanup**: `confluence_delete_content_version` removes a specific historical version of a page.

These wire previously-unused generated client services (`LabelService`, `SpaceLabelService`, `SpaceWatchersService`, `AccessModeService`, `DefaultService`, `GlobalPermissionsService`, `ContentVersionService`) into `ConfluenceService` and the tool registry, bringing the Confluence tool count to 112.
