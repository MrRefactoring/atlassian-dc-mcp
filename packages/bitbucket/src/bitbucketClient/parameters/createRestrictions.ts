import type { RestrictionRequest } from '../models/index.js';

export interface CreateRestrictions {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Array<RestrictionRequest>;
}
