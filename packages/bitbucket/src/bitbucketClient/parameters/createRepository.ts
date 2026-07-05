import type { Repository } from '../models/index.js';

export interface CreateRepository {
  projectKey: string;
  requestBody?: Repository;
}
