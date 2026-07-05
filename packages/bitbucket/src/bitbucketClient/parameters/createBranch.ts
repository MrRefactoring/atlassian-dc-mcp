import type { BranchCreateRequest } from '../models/index.js';

export interface CreateBranch {
  projectKey: string;
  repositorySlug: string;
  requestBody: BranchCreateRequest;
}
