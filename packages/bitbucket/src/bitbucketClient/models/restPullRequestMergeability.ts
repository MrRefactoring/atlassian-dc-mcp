import { z } from 'zod';

export const RestPullRequestMergeabilitySchema = z.looseObject({
  canMerge: z.boolean().optional(),
  conflicted: z.boolean().optional(),
  outcome: z.string().optional(),
  vetoes: z.array(z.looseObject({
    summaryMessage: z.string().optional(),
    detailedMessage: z.string().optional(),
  })).optional(),
});

export type RestPullRequestMergeability = z.infer<typeof RestPullRequestMergeabilitySchema>;
