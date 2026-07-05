import { z } from 'zod';
import { CommentSchema } from '../models/index.js';

export const CreatePullRequestCommentSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  ...CommentSchema.shape,
});

export type CreatePullRequestComment = z.infer<typeof CreatePullRequestCommentSchema>;
