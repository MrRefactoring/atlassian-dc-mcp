export interface CommentAnchor {
  fromHash: string;
  toHash: string;
  line: number;
  lineType: string;
  fileType: string;
  path: string;
  diffType: string;
  orphaned: boolean;
  multilineMarker?: {
    startLine: number;
    startLineType: string;
  };
}
