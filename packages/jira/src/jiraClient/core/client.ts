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
  // Jira responses pass through unchanged (no response mappers) and the model schemas
  // are derived from the generated OpenAPI spec, whose response shapes are only
  // partially verified against a live instance. Validate softly by default: verified
  // responses parse strictly, but a schema that doesn't match a real response passes
  // through raw (with a logged warning) instead of rejecting it. Callers can override —
  // the live-verification sweep opts into strict parsing with `softValidation: false`.
  // `X-Atlassian-Token: no-check` opts out of Jira's XSRF form-token check. It is a no-op
  // for the many endpoints that already exempt JSON-body requests, but bodyless mutations
  // (e.g. PUT .../showWhenEmpty/{value}) are otherwise rejected with "XSRF check failed".
  const http = createHttpClient({
    ...config,
    softValidation: config.softValidation ?? true,
    headers: { 'X-Atlassian-Token': 'no-check', ...config.headers },
  });

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
