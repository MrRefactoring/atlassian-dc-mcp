import { createHttpClient, bindGroup } from 'datacenter-mcp-core';
import type { HttpClientConfig, SendRequestOptions } from 'datacenter-mcp-core';
import * as authentication from '../api/authentication.js';
import * as builds from '../api/builds.js';
import * as permissions from '../api/permissions.js';
import * as projects from '../api/projects.js';
import * as pullRequests from '../api/pullRequests.js';
import * as repositories from '../api/repositories.js';
import * as security from '../api/security.js';

/**
 * Create a namespaced Bitbucket client bound to an instance.
 *
 * Each resource group exposes one method per endpoint, taking a single named
 * parameters object, e.g. `bb.pullRequests.get({ projectKey, repositorySlug, pullRequestId })`.
 */
export function createBitbucketClient(config: HttpClientConfig) {
  const http = createHttpClient(config);

  return {
    authentication: bindGroup(authentication, http),
    builds: bindGroup(builds, http),
    permissions: bindGroup(permissions, http),
    projects: bindGroup(projects, http),
    pullRequests: bindGroup(pullRequests, http),
    repositories: bindGroup(repositories, http),
    security: bindGroup(security, http),
    /**
     * Low-level escape hatch for the handful of endpoints outside the generated
     * resource groups (e.g. `/users`, dashboard, branch-model config).
     */
    request: <T>(options: SendRequestOptions<T>): Promise<T> => http.sendRequest(options),
  };
}

export type BitbucketClient = ReturnType<typeof createBitbucketClient>;
