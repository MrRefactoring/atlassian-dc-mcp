import { z } from 'zod';

export const DeleteCommentSchema = z.object({
  projectKey: z.string(),
  commentId: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  version: z.string().optional(),
});

export type DeleteComment = z.infer<typeof DeleteCommentSchema>;
