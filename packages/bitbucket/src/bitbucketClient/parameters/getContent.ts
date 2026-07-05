import { z } from 'zod';

export const GetContentSchema = z.object({
  path: z.string(),
  projectKey: z.string(),
  repositorySlug: z.string(),
  noContent: z.string().optional(),
  at: z.string().optional(),
  size: z.string().optional(),
  blame: z.string().optional(),
  type: z.string().optional(),
});

export type GetContent = z.infer<typeof GetContentSchema>;
