import { z } from 'zod';
import { SetInsightReportRequestSchema } from '../models/index.js';

export const SetACodeInsightsReportSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  key: z.string(),
  ...SetInsightReportRequestSchema.shape,
});

export type SetACodeInsightsReport = z.infer<typeof SetACodeInsightsReportSchema>;
