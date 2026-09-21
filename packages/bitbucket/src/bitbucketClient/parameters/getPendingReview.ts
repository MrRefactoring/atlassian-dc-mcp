import { z } from 'zod';

export const GetPendingReviewSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  pullRequestId: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetPendingReview = z.infer<typeof GetPendingReviewSchema>;
