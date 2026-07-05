import { z } from 'zod';

export const DeleteProjectAccessTokenSchema = z.object({
  projectKey: z.string(),
  tokenId: z.string(),
});

export type DeleteProjectAccessToken = z.infer<typeof DeleteProjectAccessTokenSchema>;
