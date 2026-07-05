import type { CreateTagRequest } from '../models/index.js';

export interface CreateTagForRepository {
  projectKey: string;
  repositorySlug: string;
  requestBody?: CreateTagRequest;
}
