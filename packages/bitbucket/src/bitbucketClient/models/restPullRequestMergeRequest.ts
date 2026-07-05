import { z } from 'zod';

export const RestPullRequestMergeRequestSchema = z.looseObject({
  autoMerge: z.boolean().optional(),
  autoSubject: z.string().optional(),
  message: z.string().optional(),
  strategyId: z.string().optional(),
  version: z.number().optional(),
});

export type RestPullRequestMergeRequest = z.infer<typeof RestPullRequestMergeRequestSchema>;
