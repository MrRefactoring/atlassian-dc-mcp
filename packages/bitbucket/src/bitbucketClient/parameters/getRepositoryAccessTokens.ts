import { z } from 'zod';

export const GetRepositoryAccessTokensSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRepositoryAccessTokens = z.infer<typeof GetRepositoryAccessTokensSchema>;
