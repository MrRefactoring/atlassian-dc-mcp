import type { McpServer, ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import type { ZodRawShape } from 'zod';

/**
 * MCP tool annotations (readOnlyHint / destructiveHint / idempotentHint / title)
 * are the standard signal a host uses to decide whether it can auto-approve a
 * call and whether to warn the user before a mutation. This module derives them
 * mechanically from the `<product>_<verb>_<noun>` naming convention shared by
 * every tool in this monorepo, so all 400+ tools get consistent hints without a
 * hand-maintained annotation per registration.
 *
 * The verb is the first token after the product prefix (e.g. `jira_get_issue`
 * → `get`). Callers that need a different classification for a specific tool can
 * pass an explicit `annotations` object to {@link registerAnnotatedTool}; it is
 * merged over the derived hints and wins.
 */

// Reads never mutate: the host can auto-approve them.
const READ_VERBS = new Set(['get', 'find', 'validate', 'search', 'list', 'download']);

// Destructive writes may irreversibly remove data: the host should warn first.
// `merge` covers merge-version, which reassigns issues and drops the source version.
const DESTRUCTIVE_VERBS = new Set(['delete', 'remove', 'merge']);

// Idempotent writes: re-applying the same call with the same args is a no-op.
const IDEMPOTENT_WRITE_VERBS = new Set([
  'update',
  'set',
  'rename',
  'reset',
  'restore',
  'archive',
  'move',
  'assign',
  'apply',
  'change',
  'partial',
  'rank',
  'release',
]);

// Any other verb (create/add/post/upload/link/notify/start/transition/…) is a
// non-idempotent write: repeating it has additional effects (e.g. a duplicate).

function humanizeToolName(name: string): string {
  const words = name.split('_').slice(1); // drop the product prefix
  const phrase = words.join(' ').trim();

  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

/**
 * Derives MCP tool annotations from a `<product>_<verb>_<noun>` tool name.
 * Every tool talks to a remote Atlassian instance, so `openWorldHint` is always
 * true.
 */
export function deriveToolAnnotations(name: string): ToolAnnotations {
  const verb = name.split('_')[1] ?? '';
  const base: ToolAnnotations = {
    title: humanizeToolName(name),
    openWorldHint: true,
  };

  if (READ_VERBS.has(verb)) {
    return { ...base, readOnlyHint: true };
  }
  if (DESTRUCTIVE_VERBS.has(verb)) {
    return { ...base, readOnlyHint: false, destructiveHint: true, idempotentHint: false };
  }
  if (IDEMPOTENT_WRITE_VERBS.has(verb)) {
    return { ...base, readOnlyHint: false, destructiveHint: false, idempotentHint: true };
  }

  return { ...base, readOnlyHint: false, destructiveHint: false, idempotentHint: false };
}

/**
 * Registers a tool with annotations auto-derived from its name. Drop-in for
 * `server.registerTool(name, config, cb)` — the only change at the call site is
 * `server.registerTool(` → `registerAnnotatedTool(server, `. An explicit
 * `config.annotations` is merged over the derived hints and wins.
 */
export function registerAnnotatedTool<InputArgs extends ZodRawShape>(
  server: McpServer,
  name: string,
  config: {
    title?: string;
    description?: string;
    inputSchema: InputArgs;
    annotations?: ToolAnnotations;
    _meta?: Record<string, unknown>;
  },
  cb: ToolCallback<InputArgs>,
) {
  return server.registerTool(
    name,
    {
      ...config,
      annotations: { ...deriveToolAnnotations(name), ...config.annotations },
    },
    cb,
  );
}
