import { z } from 'zod';

export const GpgKeySchema = z.looseObject({
  id: z.string().optional(),
  text: z.string().optional(),
  fingerprint: z.string().optional(),
  emailAddress: z.string().optional(),
  expiryDate: z.number().optional(),
  lastAuthenticated: z.string().optional(),
  subKeys: z.array(z.looseObject({})).optional(),
});

export type GpgKey = z.infer<typeof GpgKeySchema>;
