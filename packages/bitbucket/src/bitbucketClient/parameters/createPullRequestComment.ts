import type { Comment } from '../models/index.js';

export interface CreatePullRequestComment {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: Comment;
}
