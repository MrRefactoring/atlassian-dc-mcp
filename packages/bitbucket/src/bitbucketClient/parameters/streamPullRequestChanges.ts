import { z } from 'zod';

export const StreamPullRequestChangesSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  sinceId: z.string().optional(),
  changeScope: z.string().optional(),
  untilId: z.string().optional(),
  withComments: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type StreamPullRequestChanges = z.infer<typeof StreamPullRequestChangesSchema>;
