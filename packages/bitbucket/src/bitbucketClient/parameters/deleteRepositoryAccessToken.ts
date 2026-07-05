import { z } from 'zod';

export const DeleteRepositoryAccessTokenSchema = z.object({
  projectKey: z.string(),
  tokenId: z.string(),
  repositorySlug: z.string(),
});

export type DeleteRepositoryAccessToken = z.infer<typeof DeleteRepositoryAccessTokenSchema>;
