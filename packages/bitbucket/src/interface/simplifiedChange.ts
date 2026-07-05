import type { SimplifiedPath } from './simplifiedPath.js';

export interface SimplifiedChange {
  contentId: string;
  path: SimplifiedPath;
  srcPath?: SimplifiedPath;
  type: string;
  gitChangeType: string;
  comments?: number;
}
