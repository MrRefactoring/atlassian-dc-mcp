import { z } from 'zod';

export const GetReviewersSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  targetRepoId: z.string().optional(),
  sourceRepoId: z.string().optional(),
  sourceRefId: z.string().optional(),
  targetRefId: z.string().optional(),
});

export type GetReviewers = z.infer<typeof GetReviewersSchema>;
