import type { PullRequestDeclineRequest } from '../models/index.js';

export interface Decline {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
  requestBody?: PullRequestDeclineRequest;
}
