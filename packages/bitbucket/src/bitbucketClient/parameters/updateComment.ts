import { z } from 'zod';
import { CommentSchema } from '../models/index.js';

export const UpdateCommentSchema = z.object({
  projectKey: z.string(),
  commentId: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  ...CommentSchema.shape,
});

export type UpdateComment = z.infer<typeof UpdateCommentSchema>;
