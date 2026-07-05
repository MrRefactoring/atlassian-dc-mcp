import type { ChangeLinks } from './changeLinks.js';
import type { ChangeProperties } from './changeProperties.js';
import type { PathInfo } from './pathInfo.js';

export interface PRChange {
  contentId: string;
  fromContentId: string;
  path: PathInfo;
  srcPath?: PathInfo;
  percentUnchanged?: number;
  type: string;
  nodeType?: string;
  executable?: boolean;
  srcExecutable?: boolean;
  links?: ChangeLinks;
  properties: ChangeProperties;
}
