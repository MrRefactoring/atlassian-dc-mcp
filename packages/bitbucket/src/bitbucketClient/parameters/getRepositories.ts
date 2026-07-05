import { z } from 'zod';

export const GetRepositoriesSchema = z.object({
  projectKey: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRepositories = z.infer<typeof GetRepositoriesSchema>;
