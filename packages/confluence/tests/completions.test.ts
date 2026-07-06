import { describe, expect, it } from 'vitest';
import { createConfluenceCompleters } from '../src/completions.js';
import type { ConfluenceService } from '../src/confluenceService.js';

function fakeService(getSpaces: () => Promise<unknown>): ConfluenceService {
  return { getSpaces } as unknown as ConfluenceService;
}

describe('confluence completers', () => {
  it('spaceKey maps results[].key and filters by value', async () => {
    const completers = createConfluenceCompleters(
      fakeService(async () => ({ success: true, data: { results: [{ key: 'ENG' }, { key: 'DESIGN' }, { key: 'ENGINEERING' }] } })),
    );

    expect(await completers.spaceKey('eng')).toEqual(['ENG', 'ENGINEERING']);
    expect(await completers.spaceKey('')).toEqual(['ENG', 'DESIGN', 'ENGINEERING']);
  });

  it('spaceKey returns [] when the lookup fails', async () => {
    const completers = createConfluenceCompleters(fakeService(async () => ({ success: false })));

    expect(await completers.spaceKey('e')).toEqual([]);
  });

  it('spaceKey returns [] when the service throws', async () => {
    const completers = createConfluenceCompleters(fakeService(async () => {
      throw new Error('boom');
    }));

    expect(await completers.spaceKey('e')).toEqual([]);
  });
});
