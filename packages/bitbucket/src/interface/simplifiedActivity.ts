import type { SimplifiedComment } from './simplifiedComment.js';
import type { SimplifiedUser } from './simplifiedUser.js';

export interface SimplifiedActivity {
  id: number;
  createdDate: number;
  user: SimplifiedUser;
  action: string;
  commentAction?: string;
  comment?: SimplifiedComment;
}
