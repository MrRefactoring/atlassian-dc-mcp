import { z } from 'zod';

export const DeleteRepositorySchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type DeleteRepository = z.infer<typeof DeleteRepositorySchema>;
