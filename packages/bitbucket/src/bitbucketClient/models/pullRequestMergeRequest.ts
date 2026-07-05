import { z } from 'zod';

export const PullRequestMergeRequestSchema = z.looseObject({
  autoMerge: z.boolean().optional(),
  autoSubject: z.string().optional(),
  message: z.string().optional(),
  strategyId: z.string().optional(),
  version: z.number().optional(),
});

export type PullRequestMergeRequest = z.infer<typeof PullRequestMergeRequestSchema>;
