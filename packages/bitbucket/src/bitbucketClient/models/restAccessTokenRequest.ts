import { z } from 'zod';

export const RestAccessTokenRequestSchema = z.looseObject({
  expiryDays: z.number().optional(),
  name: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type RestAccessTokenRequest = z.infer<typeof RestAccessTokenRequestSchema>;
