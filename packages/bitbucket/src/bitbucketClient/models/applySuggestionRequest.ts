import { z } from 'zod';

export const ApplySuggestionRequestSchema = z.looseObject({
  commentVersion: z.number().optional(),
  commitMessage: z.string().optional(),
  pullRequestVersion: z.number().optional(),
  suggestionIndex: z.number().optional(),
});

export type ApplySuggestionRequest = z.infer<typeof ApplySuggestionRequestSchema>;
