import { z } from 'zod';

export const PullRequestMergeabilitySchema = z.looseObject({
  canMerge: z.boolean().optional(),
  conflicted: z.boolean().optional(),
  outcome: z.string().optional(),
  vetoes: z.array(z.looseObject({
    summaryMessage: z.string().optional(),
    detailedMessage: z.string().optional(),
  })).optional(),
});

export type PullRequestMergeability = z.infer<typeof PullRequestMergeabilitySchema>;
