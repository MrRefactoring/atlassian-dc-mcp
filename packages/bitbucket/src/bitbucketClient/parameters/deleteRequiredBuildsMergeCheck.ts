import { z } from 'zod';

export const DeleteRequiredBuildsMergeCheckSchema = z.object({
  projectKey: z.string(),
  id: z.number(),
  repositorySlug: z.string(),
});

export type DeleteRequiredBuildsMergeCheck = z.infer<typeof DeleteRequiredBuildsMergeCheckSchema>;
