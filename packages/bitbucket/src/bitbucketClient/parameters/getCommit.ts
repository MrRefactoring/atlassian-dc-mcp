import { z } from 'zod';

export const GetCommitSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  path: z.string().optional(),
});

export type GetCommit = z.infer<typeof GetCommitSchema>;
