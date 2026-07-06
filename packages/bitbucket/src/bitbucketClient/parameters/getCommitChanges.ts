import { z } from 'zod';

export const GetCommitChangesSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  commitId: z.string(),
  since: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetCommitChanges = z.infer<typeof GetCommitChangesSchema>;
