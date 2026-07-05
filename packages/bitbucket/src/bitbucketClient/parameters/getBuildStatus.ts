import { z } from 'zod';

export const GetBuildStatusSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  key: z.string(),
});

export type GetBuildStatus = z.infer<typeof GetBuildStatusSchema>;
