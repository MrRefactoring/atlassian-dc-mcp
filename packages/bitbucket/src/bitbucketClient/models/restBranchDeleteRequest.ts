import { z } from 'zod';

export const RestBranchDeleteRequestSchema = z.looseObject({
  dryRun: z.boolean().optional(),
  endPoint: z.string().optional(),
  name: z.string().optional(),
});

export type RestBranchDeleteRequest = z.infer<typeof RestBranchDeleteRequestSchema>;
