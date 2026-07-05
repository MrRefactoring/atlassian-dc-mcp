import { z } from 'zod';

export const GetBranchesSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  boostMatches: z.boolean().optional(),
  context: z.string().optional(),
  orderBy: z.enum(['ALPHABETICAL', 'MODIFICATION']).optional(),
  details: z.boolean().optional(),
  filterText: z.string().optional(),
  base: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetBranches = z.infer<typeof GetBranchesSchema>;
