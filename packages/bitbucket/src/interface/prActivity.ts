import type { BitbucketUser } from './bitbucketUser.js';
import type { Comment } from './comment.js';
import type { CommentAnchor } from './commentAnchor.js';
import type { Diff } from './diff.js';

export interface PRActivity {
  id: number;
  createdDate: number;
  user: BitbucketUser;
  action: string;
  commentAction?: string;
  comment?: Comment;
  commentAnchor?: CommentAnchor;
  diff?: Diff;
}
