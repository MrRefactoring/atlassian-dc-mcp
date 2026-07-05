import type { Repository } from '../models/index.js';

export interface ForkRepository {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Repository;
}
