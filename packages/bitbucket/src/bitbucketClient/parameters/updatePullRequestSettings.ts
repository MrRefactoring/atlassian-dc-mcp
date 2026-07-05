import type { RepositoryPullRequestSettings } from '../models/index.js';

export interface UpdatePullRequestSettings {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RepositoryPullRequestSettings;
}
