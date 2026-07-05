import { z } from 'zod';

export const RestApplySuggestionRequestSchema = z.looseObject({
  commentVersion: z.number().optional(),
  commitMessage: z.string().optional(),
  pullRequestVersion: z.number().optional(),
  suggestionIndex: z.number().optional(),
});

export type RestApplySuggestionRequest = z.infer<typeof RestApplySuggestionRequestSchema>;
