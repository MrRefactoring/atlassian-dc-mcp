import { z } from 'zod';
import { ApplySuggestionRequestSchema } from '../models/index.js';

export const ApplySuggestionSchema = z.object({
  projectKey: z.string(),
  commentId: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  ...ApplySuggestionRequestSchema.shape,
});

export type ApplySuggestion = z.infer<typeof ApplySuggestionSchema>;
