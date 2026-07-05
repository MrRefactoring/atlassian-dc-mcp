import { z } from 'zod';

export const AccessTokenRequestSchema = z.looseObject({
  expiryDays: z.number().optional(),
  name: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type AccessTokenRequest = z.infer<typeof AccessTokenRequestSchema>;
