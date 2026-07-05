import type { DefaultReviewersRequest } from '../models/index.js';

export interface CreatePullRequestCondition {
  projectKey: string;
  repositorySlug: string;
  requestBody?: DefaultReviewersRequest;
}
