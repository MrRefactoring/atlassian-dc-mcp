import { z } from 'zod';

export const GetDefaultBranchSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type GetDefaultBranch = z.infer<typeof GetDefaultBranchSchema>;
