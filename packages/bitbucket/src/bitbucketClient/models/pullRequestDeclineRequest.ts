import { z } from 'zod';

export const PullRequestDeclineRequestSchema = z.looseObject({
  comment: z.string().optional(),
  version: z.number().optional(),
});

export type PullRequestDeclineRequest = z.infer<typeof PullRequestDeclineRequestSchema>;
