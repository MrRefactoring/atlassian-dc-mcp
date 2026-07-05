import { z } from 'zod';

export const GetForkedRepositoriesSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetForkedRepositories = z.infer<typeof GetForkedRepositoriesSchema>;
