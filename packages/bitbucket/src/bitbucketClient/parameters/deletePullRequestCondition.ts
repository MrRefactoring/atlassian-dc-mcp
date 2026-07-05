import { z } from 'zod';

export const DeletePullRequestConditionSchema = z.object({
  projectKey: z.string(),
  id: z.number(),
  repositorySlug: z.string(),
});

export type DeletePullRequestCondition = z.infer<typeof DeletePullRequestConditionSchema>;
