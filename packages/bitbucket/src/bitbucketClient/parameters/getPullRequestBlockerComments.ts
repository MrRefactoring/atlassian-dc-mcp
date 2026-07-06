import { z } from 'zod';

export const GetPullRequestBlockerCommentsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  pullRequestId: z.string(),
  count: z.boolean().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetPullRequestBlockerComments = z.infer<typeof GetPullRequestBlockerCommentsSchema>;
