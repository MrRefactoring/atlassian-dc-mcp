import type { Comment } from '../models/index.js';

export interface UpdateComment {
  projectKey: string;
  commentId: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: Comment;
}
