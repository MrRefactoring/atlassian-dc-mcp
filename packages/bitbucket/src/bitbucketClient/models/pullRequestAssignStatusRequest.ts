import { z } from 'zod';

export const PullRequestAssignStatusRequestSchema = z.looseObject({
  lastReviewedCommit: z.string().optional(),
  status: z.enum(['UNAPPROVED', 'NEEDS_WORK', 'APPROVED']).optional(),
});

export type PullRequestAssignStatusRequest = z.infer<typeof PullRequestAssignStatusRequestSchema>;
