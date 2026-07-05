import { z } from 'zod';

export const GetPageOfRequiredBuildsMergeChecksSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetPageOfRequiredBuildsMergeChecks = z.infer<typeof GetPageOfRequiredBuildsMergeChecksSchema>;
