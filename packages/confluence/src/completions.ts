import { filterCompletions } from 'datacenter-mcp-core';
import type { ConfluenceService } from './confluenceService.js';

/**
 * Completion callbacks for prompt arguments and resource-template variables.
 * Each hits a live list endpoint and filters by the partial value the user has
 * typed. Completions must never throw, so a failed lookup yields an empty list.
 */
export function createConfluenceCompleters(service: ConfluenceService) {
  return {
    spaceKey: async (value: string): Promise<string[]> => {
      try {
        const res = await service.getSpaces(undefined, undefined, undefined, undefined, undefined, undefined, 100);
        const results = res.success ? (res.data as { results?: { key?: string }[] }).results : undefined;
        const keys = (results ?? []).map((space) => space.key).filter((key): key is string => typeof key === 'string');

        return filterCompletions(keys, value);
      } catch {
        return [];
      }
    },
  };
}
