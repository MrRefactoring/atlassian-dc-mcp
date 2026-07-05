import { z } from 'zod';
import { CommentSchema } from '../models/index.js';

export const CreateCommitCommentSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  since: z.string().optional(),
  ...CommentSchema.shape,
});

export type CreateCommitComment = z.infer<typeof CreateCommitCommentSchema>;
