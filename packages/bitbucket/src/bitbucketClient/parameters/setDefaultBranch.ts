import type { Branch } from '../models/index.js';

export interface SetDefaultBranch {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Branch;
}
