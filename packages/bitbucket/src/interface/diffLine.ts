export interface DiffLine {
  destination: number;
  source: number;
  line: string;
  truncated: boolean;
  commentIds?: number[];
}
