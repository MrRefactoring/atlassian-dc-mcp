import { z } from 'zod';

export const GetCommentsSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  path: z.string().optional(),
  since: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetComments = z.infer<typeof GetCommentsSchema>;
