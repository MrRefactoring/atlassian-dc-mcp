import type { AccessTokenRequest } from '../models/index.js';

export interface CreateRepositoryAccessToken {
  projectKey: string;
  repositorySlug: string;
  requestBody?: AccessTokenRequest;
}
