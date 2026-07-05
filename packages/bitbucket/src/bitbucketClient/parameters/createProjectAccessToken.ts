import type { AccessTokenRequest } from '../models/index.js';

export interface CreateProjectAccessToken {
  projectKey: string;
  requestBody?: AccessTokenRequest;
}
