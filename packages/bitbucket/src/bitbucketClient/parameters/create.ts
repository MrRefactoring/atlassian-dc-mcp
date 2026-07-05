import type { PullRequest } from '../models/index.js';

export interface Create {
  projectKey: string;
  repositorySlug: string;
  requestBody?: PullRequest;
}
