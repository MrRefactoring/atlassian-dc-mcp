import { z } from 'zod';

export const GetRepositoryHooksSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  type: z.enum(['PRE_RECEIVE', 'POST_RECEIVE']).optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRepositoryHooks = z.infer<typeof GetRepositoryHooksSchema>;
