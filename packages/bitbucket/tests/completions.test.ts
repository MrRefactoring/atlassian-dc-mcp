import { describe, expect, it } from 'vitest';
import { createBitbucketCompleters } from '../src/completions.js';
import type { BitbucketService } from '../src/bitbucketService.js';

function fakeService(overrides: Partial<Record<'getProjects' | 'getRepositories', (...args: unknown[]) => Promise<unknown>>>): BitbucketService {
  return overrides as unknown as BitbucketService;
}

describe('bitbucket completers', () => {
  it('projectKey maps values[].key and filters', async () => {
    const completers = createBitbucketCompleters(
      fakeService({ getProjects: async () => ({ success: true, data: { values: [{ key: 'PROJ' }, { key: 'OPS' }] } }) }),
    );

    expect(await completers.projectKey('pr')).toEqual(['PROJ']);
  });

  it('repositorySlug scopes to the projectKey from context and maps values[].slug', async () => {
    let calledWith: unknown;
    const completers = createBitbucketCompleters(
      fakeService({
        getRepositories: async (projectKey: unknown) => {
          calledWith = projectKey;

          return { success: true, data: { values: [{ slug: 'demo' }, { slug: 'docs' }] } };
        },
      }),
    );

    const all = await completers.repositorySlug('', { arguments: { projectKey: 'PROJ' } });
    const filtered = await completers.repositorySlug('do', { arguments: { projectKey: 'PROJ' } });

    expect(calledWith).toBe('PROJ');
    expect(all).toEqual(['demo', 'docs']);
    expect(filtered).toEqual(['docs']);
  });

  it('repositorySlug returns [] when no projectKey is in context', async () => {
    let called = false;
    const completers = createBitbucketCompleters(
      fakeService({
        getRepositories: async () => {
          called = true;

          return { success: true, data: { values: [] } };
        },
      }),
    );

    expect(await completers.repositorySlug('d', undefined)).toEqual([]);
    expect(called).toBe(false);
  });

  it('projectKey returns [] on failure', async () => {
    const completers = createBitbucketCompleters(fakeService({ getProjects: async () => ({ success: false }) }));

    expect(await completers.projectKey('p')).toEqual([]);
  });
});
