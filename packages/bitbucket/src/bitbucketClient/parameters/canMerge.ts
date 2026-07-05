import { z } from 'zod';

export const CanMergeSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
});

export type CanMerge = z.infer<typeof CanMergeSchema>;
