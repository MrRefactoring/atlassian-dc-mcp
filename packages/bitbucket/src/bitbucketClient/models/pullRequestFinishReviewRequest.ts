import { z } from 'zod';

export const PullRequestFinishReviewRequestSchema = z.looseObject({
  commentText: z.string().optional(),
  lastReviewedCommit: z.string().optional(),
  participantStatus: z.enum(['UNAPPROVED', 'NEEDS_WORK', 'APPROVED']).optional(),
});

export type PullRequestFinishReviewRequest = z.infer<typeof PullRequestFinishReviewRequestSchema>;
