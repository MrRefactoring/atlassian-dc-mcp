import type { SimplifiedAnchor } from './simplifiedAnchor.js';
import type { SimplifiedUser } from './simplifiedUser.js';

export interface SimplifiedComment {
  id: number;
  text: string;
  author: SimplifiedUser;
  createdDate: number;
  anchor?: SimplifiedAnchor;
  comments: SimplifiedComment[];
  threadResolved: boolean;
  state: string;
}
