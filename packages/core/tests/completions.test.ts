import { describe, expect, it } from 'vitest';
import { filterCompletions } from '../src/completions.js';

describe('filterCompletions', () => {
  const candidates = ['ENG', 'DESIGN', 'ENGINEERING', 'ops'];

  it('returns all candidates (capped) for an empty value', () => {
    expect(filterCompletions(candidates, '')).toEqual(candidates);
  });

  it('matches case-insensitively as a substring', () => {
    expect(filterCompletions(candidates, 'eng')).toEqual(['ENG', 'ENGINEERING']);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterCompletions(candidates, 'zzz')).toEqual([]);
  });

  it('caps the number of results', () => {
    const many = Array.from({ length: 120 }, (_, i) => `item-${i}`);

    expect(filterCompletions(many, '', 50)).toHaveLength(50);
  });

  it('caps matched results too', () => {
    const many = Array.from({ length: 120 }, (_, i) => `item-${i}`);

    expect(filterCompletions(many, 'item', 10)).toHaveLength(10);
  });
});
