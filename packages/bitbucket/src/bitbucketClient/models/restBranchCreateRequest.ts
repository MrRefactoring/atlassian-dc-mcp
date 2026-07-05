import { z } from 'zod';

export const RestBranchCreateRequestSchema = z.looseObject({
  name: z.string().optional(),
  startPoint: z.string().optional(),
});

export type RestBranchCreateRequest = z.infer<typeof RestBranchCreateRequestSchema>;
