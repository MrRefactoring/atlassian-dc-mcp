import { z } from 'zod';

export const GetAnnotationsSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  key: z.string(),
});

export type GetAnnotations = z.infer<typeof GetAnnotationsSchema>;
