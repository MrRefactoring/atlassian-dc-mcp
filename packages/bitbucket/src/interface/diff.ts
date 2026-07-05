import type { DiffDestination } from './diffDestination.js';
import type { DiffHunk } from './diffHunk.js';
import type { DiffProperties } from './diffProperties.js';

export interface Diff {
  destination: DiffDestination;
  hunks: DiffHunk[];
  truncated: boolean;
  properties?: DiffProperties;
}
