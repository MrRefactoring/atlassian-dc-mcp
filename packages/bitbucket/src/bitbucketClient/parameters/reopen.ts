import type { PullRequestReopenRequest } from '../models/index.js';

export interface Reopen {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
  requestBody?: PullRequestReopenRequest;
}
