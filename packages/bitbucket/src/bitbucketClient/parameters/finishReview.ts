import { z } from 'zod';
import { PullRequestFinishReviewRequestSchema } from '../models/index.js';

export const FinishReviewSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  pullRequestId: z.string(),
  ...PullRequestFinishReviewRequestSchema.shape,
});

export type FinishReview = z.infer<typeof FinishReviewSchema>;
