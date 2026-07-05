import { z } from 'zod';
import { AccessTokenSchema } from './accessToken.js';

export const RawAccessTokenSchema = AccessTokenSchema.extend({
  token: z.string().optional(),
});

export type RawAccessToken = z.infer<typeof RawAccessTokenSchema>;
