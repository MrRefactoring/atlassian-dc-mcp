import { describe, expect, it } from 'vitest';
import { createJiraCompleters } from '../src/completions.js';
import type { JiraService } from '../src/jiraService.js';

function fakeService(overrides: Partial<Record<'getProjects' | 'getBoards', () => Promise<unknown>>>): JiraService {
  return overrides as unknown as JiraService;
}

describe('jira completers', () => {
  it('projectKey maps the array of projects to keys and filters', async () => {
    const completers = createJiraCompleters(
      fakeService({ getProjects: async () => ({ success: true, data: [{ key: 'PROJ' }, { key: 'OPS' }, { key: 'PROTO' }] }) }),
    );

    expect(await completers.projectKey('pro')).toEqual(['PROJ', 'PROTO']);
  });

  it('boardId maps values[].id to strings and filters', async () => {
    const completers = createJiraCompleters(
      fakeService({ getBoards: async () => ({ success: true, data: { values: [{ id: 1 }, { id: 42 }, { id: 421 }] } }) }),
    );

    expect(await completers.boardId('42')).toEqual(['42', '421']);
  });

  it('returns [] on failure', async () => {
    const completers = createJiraCompleters(
      fakeService({
        getProjects: async () => ({ success: false }),
        getBoards: async () => {
          throw new Error('boom');
        },
      }),
    );

    expect(await completers.projectKey('p')).toEqual([]);
    expect(await completers.boardId('4')).toEqual([]);
  });
});
