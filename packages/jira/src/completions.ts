import { filterCompletions } from 'datacenter-mcp-core';
import type { JiraService } from './jiraService.js';

/**
 * Completion callbacks for prompt arguments and resource-template variables.
 * Each hits a live list endpoint and filters by the partial value the user has
 * typed. Completions must never throw, so a failed lookup yields an empty list.
 */
export function createJiraCompleters(service: JiraService) {
  return {
    projectKey: async (value: string): Promise<string[]> => {
      try {
        const res = await service.getProjects();
        const projects = res.success ? (res.data as { key?: string }[]) : undefined;
        const keys = (projects ?? []).map((project) => project.key).filter((key): key is string => typeof key === 'string');

        return filterCompletions(keys, value);
      } catch {
        return [];
      }
    },
    boardId: async (value: string): Promise<string[]> => {
      try {
        const res = await service.getBoards(100);
        const boards = res.success ? (res.data as { values?: { id?: number }[] }).values : undefined;
        const ids = (boards ?? [])
          .map((board) => board.id)
          .filter((id): id is number => typeof id === 'number')
          .map((id) => id.toString());

        return filterCompletions(ids, value);
      } catch {
        return [];
      }
    },
  };
}
