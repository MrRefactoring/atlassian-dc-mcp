import { createHttpClient } from './httpClient.js';
import type { BitbucketClientConfig, HttpClient, SendRequestOptions } from '../interface/index.js';
import * as authentication from '../api/authentication.js';
import * as builds from '../api/builds.js';
import * as permissions from '../api/permissions.js';
import * as projects from '../api/projects.js';
import * as pullRequests from '../api/pullRequests.js';
import * as repositories from '../api/repositories.js';
import * as security from '../api/security.js';

/** Any api/ function: takes the http client plus a single named-parameters object. */
type ApiFn = (client: HttpClient, params: never) => unknown;
type ApiGroup = Record<string, ApiFn>;

/** A group with the leading `client` argument bound, so callers pass only params. */
type BoundGroup<G extends ApiGroup> = {
  [K in keyof G]: (params: Parameters<G[K]>[1]) => ReturnType<G[K]>;
};

function bindGroup<G extends ApiGroup>(group: G, http: HttpClient): BoundGroup<G> {
  const bound = {} as Record<string, (params: never) => unknown>;

  for (const name of Object.keys(group)) {
    bound[name] = (params: never) => group[name]!(http, params);
  }

  return bound as BoundGroup<G>;
}

/**
 * Create a namespaced Bitbucket client bound to an instance.
 *
 * Each resource group exposes one method per endpoint, taking a single named
 * parameters object, e.g. `bb.pullRequests.get({ projectKey, repositorySlug, pullRequestId })`.
 */
export function createBitbucketClient(config: BitbucketClientConfig) {
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
