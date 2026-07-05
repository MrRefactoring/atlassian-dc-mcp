import { z } from 'zod';
import { BranchDeleteRequestSchema } from '../models/index.js';

export const DeleteBranchSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...BranchDeleteRequestSchema.shape,
});

export type DeleteBranch = z.infer<typeof DeleteBranchSchema>;
