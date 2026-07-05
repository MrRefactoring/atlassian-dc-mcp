import { z } from 'zod';

export const GetTagsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  orderBy: z.string().optional(),
  filterText: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetTags = z.infer<typeof GetTagsSchema>;
