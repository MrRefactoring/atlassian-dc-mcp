import { z } from 'zod';
import { BranchSchema } from '../models/index.js';

export const SetDefaultBranchSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...BranchSchema.shape,
});

export type SetDefaultBranch = z.infer<typeof SetDefaultBranchSchema>;
