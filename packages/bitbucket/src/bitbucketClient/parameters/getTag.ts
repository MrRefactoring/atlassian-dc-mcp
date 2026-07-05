import { z } from 'zod';

export const GetTagSchema = z.object({
  projectKey: z.string(),
  name: z.string(),
  repositorySlug: z.string(),
});

export type GetTag = z.infer<typeof GetTagSchema>;
