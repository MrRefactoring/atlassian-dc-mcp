import { z } from 'zod';

export const GetBuildStatusStatsSchema = z.object({
  commitId: z.string(),
  orderBy: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetBuildStatusStats = z.infer<typeof GetBuildStatusStatsSchema>;
