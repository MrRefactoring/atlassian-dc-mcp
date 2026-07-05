import type { ApplySuggestionRequest } from '../models/index.js';

export interface ApplySuggestion {
  projectKey: string;
  commentId: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody?: ApplySuggestionRequest;
}
