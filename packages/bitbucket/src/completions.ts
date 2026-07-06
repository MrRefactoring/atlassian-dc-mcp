import { filterCompletions } from 'datacenter-mcp-core';
import type { BitbucketService } from './bitbucketService.js';

/**
 * Completion callbacks for prompt arguments and resource-template variables.
 * Each hits a live list endpoint and filters by the partial value the user has
 * typed. Completions must never throw, so a failed lookup yields an empty list.
 * `repositorySlug` reads the already-chosen `projectKey` from the completion
 * context so it can scope its lookup to that project.
 */
export function createBitbucketCompleters(service: BitbucketService) {
  return {
    projectKey: async (value: string): Promise<string[]> => {
      try {
        const res = await service.getProjects(undefined, undefined, undefined, 100);
        const projects = res.success ? (res.data as { values?: { key?: string }[] }).values : undefined;
        const keys = (projects ?? []).map((project) => project.key).filter((key): key is string => typeof key === 'string');

        return filterCompletions(keys, value);
      } catch {
        return [];
      }
    },
    repositorySlug: async (value: string, context?: { arguments?: Record<string, string> }): Promise<string[]> => {
      const projectKey = context?.arguments?.projectKey;
      if (!projectKey) {
        return [];
      }

      try {
        const res = await service.getRepositories(projectKey, undefined, 100);
        const repos = res.success ? (res.data as { values?: { slug?: string }[] }).values : undefined;
        const slugs = (repos ?? []).map((repo) => repo.slug).filter((slug): slug is string => typeof slug === 'string');

        return filterCompletions(slugs, value);
      } catch {
        return [];
      }
    },
  };
}
