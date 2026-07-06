import { describe, expect, it, vi } from 'vitest';
import { deriveToolAnnotations, registerAnnotatedTool } from '../src/toolAnnotations.js';

describe('deriveToolAnnotations', () => {
  it('marks read verbs as read-only', () => {
    for (const name of [
      'jira_get_issue',
      'jira_search_issues',
      'jira_find_users',
      'jira_validate_jql',
      'jira_list_priorities',
      'jira_download_attachment',
    ]) {
      expect(deriveToolAnnotations(name).readOnlyHint, name).toBe(true);
    }
  });

  it('marks delete/remove/merge verbs as destructive writes', () => {
    for (const name of ['jira_delete_issue', 'jira_remove_watcher', 'jira_merge_version']) {
      const a = deriveToolAnnotations(name);
      expect(a.readOnlyHint, name).toBe(false);
      expect(a.destructiveHint, name).toBe(true);
      expect(a.idempotentHint, name).toBe(false);
    }
  });

  it('marks update/set-style verbs as idempotent, non-destructive writes', () => {
    for (const name of ['jira_update_issue', 'jira_set_issue_property', 'jira_assign_issue', 'jira_archive_project']) {
      const a = deriveToolAnnotations(name);
      expect(a.readOnlyHint, name).toBe(false);
      expect(a.destructiveHint, name).toBe(false);
      expect(a.idempotentHint, name).toBe(true);
    }
  });

  it('treats create/add-style verbs as non-idempotent, non-destructive writes', () => {
    for (const name of ['jira_create_issue', 'jira_add_watcher', 'jira_post_comment', 'jira_transition_issue']) {
      const a = deriveToolAnnotations(name);
      expect(a.readOnlyHint, name).toBe(false);
      expect(a.destructiveHint, name).toBe(false);
      expect(a.idempotentHint, name).toBe(false);
    }
  });

  it('always sets openWorldHint and a humanized title', () => {
    const a = deriveToolAnnotations('jira_get_issue_comments');
    expect(a.openWorldHint).toBe(true);
    expect(a.title).toBe('Get issue comments');
  });

  it('works for other product prefixes', () => {
    expect(deriveToolAnnotations('confluence_get_page').readOnlyHint).toBe(true);
    expect(deriveToolAnnotations('bitbucket_delete_repository').destructiveHint).toBe(true);
  });

  it('skips the admin namespace token and classifies the real verb', () => {
    // classic bug: `admin` read as the verb would mark a delete as a non-destructive write
    expect(deriveToolAnnotations('confluence_admin_delete_user')).toMatchObject({
      readOnlyHint: false,
      destructiveHint: true,
    });
    expect(deriveToolAnnotations('confluence_admin_get_active_users').readOnlyHint).toBe(true);
    expect(deriveToolAnnotations('confluence_admin_update_user').idempotentHint).toBe(true);
  });

  it('treats convert/compare/browse/can/is as read-only (pure/checks, no persistence)', () => {
    for (const name of [
      'confluence_convert_content_body',
      'confluence_is_watching_content',
      'bitbucket_compare_refs',
      'bitbucket_browse_repository',
      'bitbucket_can_merge_pull_request',
    ]) {
      expect(deriveToolAnnotations(name).readOnlyHint, name).toBe(true);
    }
  });

  it('treats grant/revoke/enable/disable/watch/edit as idempotent, non-destructive writes', () => {
    for (const name of [
      'confluence_grant_user_space_permissions',
      'confluence_revoke_user_space_permissions',
      'bitbucket_enable_repo_hook',
      'bitbucket_disable_repo_hook',
      'bitbucket_watch_pull_request',
      'bitbucket_edit_file',
    ]) {
      const a = deriveToolAnnotations(name);
      expect(a.readOnlyHint, name).toBe(false);
      expect(a.destructiveHint, name).toBe(false);
      expect(a.idempotentHint, name).toBe(true);
    }
  });

  it('marks pull-request merge as a destructive write', () => {
    expect(deriveToolAnnotations('bitbucket_merge_pull_request')).toMatchObject({
      readOnlyHint: false,
      destructiveHint: true,
    });
  });
});

describe('registerAnnotatedTool', () => {
  it('injects derived annotations into the registerTool config', () => {
    const registerTool = vi.fn();
    const server = { registerTool } as never;
    const cb = vi.fn();

    registerAnnotatedTool(server, 'jira_delete_issue', { description: 'x', inputSchema: {} }, cb);

    expect(registerTool).toHaveBeenCalledTimes(1);
    const [name, config] = registerTool.mock.calls[0];
    expect(name).toBe('jira_delete_issue');
    expect(config.annotations).toMatchObject({ readOnlyHint: false, destructiveHint: true, title: 'Delete issue' });
  });

  it('lets an explicit annotations object override the derived hints', () => {
    const registerTool = vi.fn();
    const server = { registerTool } as never;

    registerAnnotatedTool(
      server,
      'jira_get_something_expensive',
      { description: 'x', inputSchema: {}, annotations: { readOnlyHint: false } },
      vi.fn(),
    );

    const [, config] = registerTool.mock.calls[0];
    expect(config.annotations.readOnlyHint).toBe(false);
    expect(config.annotations.title).toBe('Get something expensive');
  });
});
