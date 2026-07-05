import type { BulkAddInsightAnnotationRequest } from '../models/index.js';

export interface AddAnnotations {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
  requestBody?: BulkAddInsightAnnotationRequest;
}
