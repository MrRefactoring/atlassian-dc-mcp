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
  const http = createHttpClient(config);

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
