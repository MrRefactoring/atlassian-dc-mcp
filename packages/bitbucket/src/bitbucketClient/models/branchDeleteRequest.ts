import { z } from 'zod';

export const BranchDeleteRequestSchema = z.looseObject({
  dryRun: z.boolean().optional(),
  endPoint: z.string().optional(),
  name: z.string().optional(),
});

export type BranchDeleteRequest = z.infer<typeof BranchDeleteRequestSchema>;
