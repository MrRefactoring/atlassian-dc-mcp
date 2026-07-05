import type { SimplifiedChange } from './simplifiedChange.js';

export interface SimplifiedPRChangesResponse {
  fromHash: string;
  toHash: string;
  changeScope: string;
  changes: SimplifiedChange[];
  summary: {
    totalChanges: number;
    additions: number;
    deletions: number;
    modifications: number;
    moves: number;
    filesWithComments: number;
  };
  isLastPage: boolean;
}
