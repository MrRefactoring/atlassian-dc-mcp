import { z } from 'zod';

export const RestPullRequestAssignStatusRequestSchema = z.looseObject({
  lastReviewedCommit: z.string().optional(),
  status: z.enum(['UNAPPROVED', 'NEEDS_WORK', 'APPROVED']).optional(),
});

export type RestPullRequestAssignStatusRequest = z.infer<typeof RestPullRequestAssignStatusRequestSchema>;
