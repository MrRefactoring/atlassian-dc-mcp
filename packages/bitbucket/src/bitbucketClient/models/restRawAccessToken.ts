import { z } from 'zod';
import { RestAccessTokenSchema } from './restAccessToken.js';

export const RestRawAccessTokenSchema = RestAccessTokenSchema.extend({
  token: z.string().optional(),
});

export type RestRawAccessToken = z.infer<typeof RestRawAccessTokenSchema>;
