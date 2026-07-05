import type { BuildStatusSetRequest } from '../models/index.js';

export interface Add {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  requestBody?: BuildStatusSetRequest;
}
