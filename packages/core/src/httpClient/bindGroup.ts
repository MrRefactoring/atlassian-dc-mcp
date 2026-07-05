import type { HttpClient } from './interface/index.js';

/** Any api/ function: takes the http client plus a single named-parameters object. */
export type ApiFn = (client: HttpClient, params: never) => unknown;
export type ApiGroup = Record<string, ApiFn>;

/** A group with the leading `client` argument bound, so callers pass only params. */
export type BoundGroup<G extends ApiGroup> = {
  [K in keyof G]: (params: Parameters<G[K]>[1]) => ReturnType<G[K]>;
};

/**
 * Bind an api/ module's free functions to an {@link HttpClient}, dropping the leading
 * `client` argument so each namespaced method takes only its named-parameters object.
 * Shared by every product's `create<Product>Client` factory.
 */
export function bindGroup<G extends ApiGroup>(group: G, http: HttpClient): BoundGroup<G> {
  const bound = {} as Record<string, (params: never) => unknown>;

  for (const name of Object.keys(group)) {
    bound[name] = (params: never) => group[name]!(http, params);
  }

  return bound as BoundGroup<G>;
}
