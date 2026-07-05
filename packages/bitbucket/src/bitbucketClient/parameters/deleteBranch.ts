import type { BranchDeleteRequest } from '../models/index.js';

export interface DeleteBranch {
  projectKey: string;
  repositorySlug: string;
  requestBody?: BranchDeleteRequest;
}
