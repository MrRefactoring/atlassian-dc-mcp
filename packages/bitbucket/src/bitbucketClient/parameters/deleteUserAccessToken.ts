import { z } from 'zod';

export const DeleteUserAccessTokenSchema = z.object({
  tokenId: z.string(),
  userSlug: z.string(),
});

export type DeleteUserAccessToken = z.infer<typeof DeleteUserAccessTokenSchema>;
