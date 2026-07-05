import { z } from 'zod';
import { BranchCreateRequestSchema } from '../models/index.js';

export const CreateBranchSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...BranchCreateRequestSchema.shape,
});

export type CreateBranch = z.infer<typeof CreateBranchSchema>;
