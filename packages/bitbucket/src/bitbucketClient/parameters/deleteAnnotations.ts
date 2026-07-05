import { z } from 'zod';

export const DeleteAnnotationsSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  key: z.string(),
  externalId: z.string().optional(),
});

export type DeleteAnnotations = z.infer<typeof DeleteAnnotationsSchema>;
