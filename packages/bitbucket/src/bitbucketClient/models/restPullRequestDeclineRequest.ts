import { z } from 'zod';

export const RestPullRequestDeclineRequestSchema = z.looseObject({
  comment: z.string().optional(),
  version: z.number().optional(),
});

export type RestPullRequestDeclineRequest = z.infer<typeof RestPullRequestDeclineRequestSchema>;
