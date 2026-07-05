import { z } from 'zod';

export const GetPullRequestSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
});

export type GetPullRequest = z.infer<typeof GetPullRequestSchema>;
