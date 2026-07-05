import { z } from 'zod';

export const DeleteACodeInsightsReportSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  key: z.string(),
});

export type DeleteACodeInsightsReport = z.infer<typeof DeleteACodeInsightsReportSchema>;
