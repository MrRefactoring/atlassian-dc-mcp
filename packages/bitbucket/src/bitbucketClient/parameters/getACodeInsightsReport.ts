import { z } from 'zod';

export const GetACodeInsightsReportSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  key: z.string(),
});

export type GetACodeInsightsReport = z.infer<typeof GetACodeInsightsReportSchema>;
