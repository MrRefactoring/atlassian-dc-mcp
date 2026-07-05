import { z } from 'zod';

export const GetPullRequestConditionsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type GetPullRequestConditions = z.infer<typeof GetPullRequestConditionsSchema>;
