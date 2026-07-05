import type { DiffSegment } from './diffSegment.js';

export interface DiffHunk {
  sourceLine: number;
  sourceSpan: number;
  destinationLine: number;
  destinationSpan: number;
  segments: DiffSegment[];
  truncated: boolean;
}
