import { z } from 'zod';

export const GetUserAccessTokensSchema = z.object({
  userSlug: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetUserAccessTokens = z.infer<typeof GetUserAccessTokensSchema>;
