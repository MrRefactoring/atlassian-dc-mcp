import { z } from 'zod';

export const GetProjectAccessTokensSchema = z.object({
  projectKey: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetProjectAccessTokens = z.infer<typeof GetProjectAccessTokensSchema>;
