import type { PullRequestMergeRequest } from '../models/index.js';

export interface Merge {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
  requestBody?: PullRequestMergeRequest;
}
