import { z } from 'zod';

export const GetRepositorySchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type GetRepository = z.infer<typeof GetRepositorySchema>;
