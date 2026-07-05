import type { PullRequest } from '../models/index.js';

export interface Update {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: PullRequest;
}
