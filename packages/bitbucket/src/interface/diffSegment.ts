import type { DiffLine } from './diffLine.js';

export interface DiffSegment {
  type: string;
  lines: DiffLine[];
  truncated: boolean;
}
