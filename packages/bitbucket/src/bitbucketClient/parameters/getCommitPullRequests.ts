import { z } from 'zod';

export const GetCommitPullRequestsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  commitId: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetCommitPullRequests = z.infer<typeof GetCommitPullRequestsSchema>;
