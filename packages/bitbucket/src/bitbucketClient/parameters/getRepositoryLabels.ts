import { z } from 'zod';

export const GetRepositoryLabelsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRepositoryLabels = z.infer<typeof GetRepositoryLabelsSchema>;
