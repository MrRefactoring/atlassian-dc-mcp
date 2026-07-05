import { z } from 'zod';

export const SshKeySchema = z.looseObject({
  id: z.number().optional(),
  text: z.string().optional(),
  label: z.string().optional(),
  algorithmType: z.string().optional(),
  bitLength: z.number().optional(),
  fingerprint: z.string().optional(),
  createdDate: z.number().optional(),
  lastAuthenticated: z.string().optional(),
  expiryDays: z.number().optional(),
});

export type SshKey = z.infer<typeof SshKeySchema>;
