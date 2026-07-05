import type { SetInsightReportRequest } from '../models/index.js';

export interface SetACodeInsightsReport {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
  requestBody?: SetInsightReportRequest;
}
