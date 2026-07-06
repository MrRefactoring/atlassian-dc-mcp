import { z } from 'zod';

export const GetCompareDiffSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  from: z.string(),
  to: z.string(),
  fromRepo: z.string().optional(),
  srcPath: z.string().optional(),
  contextLines: z.number().optional(),
  whitespace: z.string().optional(),
});

export type GetCompareDiff = z.infer<typeof GetCompareDiffSchema>;
