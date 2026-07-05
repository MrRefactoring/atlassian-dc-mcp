import type { Comment } from '../models/index.js';

export interface CreateCommitComment {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  since?: string;
  requestBody?: Comment;
}
