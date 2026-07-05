import type { BitbucketUser } from './bitbucketUser.js';
import type { CommentAnchor } from './commentAnchor.js';
import type { CommentProperties } from './commentProperties.js';
import type { PermittedOperations } from './permittedOperations.js';

export interface Comment {
  properties: CommentProperties;
  id: number;
  version: number;
  text: string;
  author: BitbucketUser;
  createdDate: number;
  updatedDate: number;
  comments: Comment[]; // Nested comments have the same structure
  anchor?: CommentAnchor;
  threadResolved: boolean;
  severity: string;
  state: string;
  permittedOperations: PermittedOperations;
}
