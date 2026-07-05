import type { PullRequestAssignStatusRequest } from '../models/index.js';

export interface UpdateStatus {
  projectKey: string;
  userSlug: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody: PullRequestAssignStatusRequest;
  version?: string;
}
