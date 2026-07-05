import type { Repository } from '../models/index.js';

export interface UpdateRepository {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Repository;
}
