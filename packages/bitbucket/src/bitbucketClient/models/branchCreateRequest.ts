import { z } from 'zod';

export const BranchCreateRequestSchema = z.looseObject({
  name: z.string().optional(),
  startPoint: z.string().optional(),
});

export type BranchCreateRequest = z.infer<typeof BranchCreateRequestSchema>;
