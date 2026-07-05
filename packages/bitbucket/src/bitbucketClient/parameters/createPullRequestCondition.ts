import { z } from 'zod';
import { DefaultReviewersRequestSchema } from '../models/index.js';

export const CreatePullRequestConditionSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...DefaultReviewersRequestSchema.shape,
});

export type CreatePullRequestCondition = z.infer<typeof CreatePullRequestConditionSchema>;
