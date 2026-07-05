import type { AccessTokenRequest } from '../models/index.js';

export interface CreateUserAccessToken {
  userSlug: string;
  requestBody?: AccessTokenRequest;
}
