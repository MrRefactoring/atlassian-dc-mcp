import { createHttpClient, bindGroup } from 'datacenter-mcp-core';
import type { HttpClientConfig, SendRequestOptions } from 'datacenter-mcp-core';
import * as admin from '../api/admin.js';
import * as agile from '../api/agile.js';
import * as issues from '../api/issues.js';
import * as projects from '../api/projects.js';
import * as users from '../api/users.js';
import * as workflows from '../api/workflows.js';

/**
 * Create a namespaced Jira client bound to an instance. Each resource group exposes one
 * method per endpoint taking a single named-parameters object, e.g.
 * `jira.issues.getIssue({ issueIdOrKey })`.
 */
export function createJiraClient(config: HttpClientConfig) {
  // Jira responses pass through unchanged (no response mappers), and the model
  // schemas are derived from the generated OpenAPI spec, whose response shapes are
  // unreliable — e.g. list endpoints like `/api/2/priority` are typed as a single
  // object but actually return an array. The previous generated client never
  // validated at runtime, so enforcing these schemas would reject valid live
  // responses. Keep the Zod schemas as the typed/documented contract but skip
  // runtime parsing until the shapes are verified against a live instance end to end.
  const http = createHttpClient({ ...config, skipParsing: true });

  return {
    admin: bindGroup(admin, http),
    agile: bindGroup(agile, http),
    issues: bindGroup(issues, http),
    projects: bindGroup(projects, http),
    users: bindGroup(users, http),
    workflows: bindGroup(workflows, http),
    /** Low-level escape hatch for endpoints outside the generated resource groups. */
    request: <T>(options: SendRequestOptions<T>): Promise<T> => http.sendRequest(options),
  };
}

export type JiraClient = ReturnType<typeof createJiraClient>;
