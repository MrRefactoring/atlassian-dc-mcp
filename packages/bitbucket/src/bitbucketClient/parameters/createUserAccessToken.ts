import { z } from 'zod';
import { AccessTokenRequestSchema } from '../models/index.js';

export const CreateUserAccessTokenSchema = z.object({
  userSlug: z.string(),
  ...AccessTokenRequestSchema.shape,
});

export type CreateUserAccessToken = z.infer<typeof CreateUserAccessTokenSchema>;
