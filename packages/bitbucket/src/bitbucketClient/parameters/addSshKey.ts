import { z } from 'zod';

export const AddSshKeySchema = z.object({
  user: z.any().optional(),
  algorithmType: z.string().optional(),
  bitLength: z.number().optional(),
  createdDate: z.string().optional(),
  expiryDays: z.number().optional(),
  fingerprint: z.string().optional(),
  id: z.number().optional(),
  label: z.string().optional(),
  lastAuthenticated: z.string().optional(),
  text: z.string().optional(),
  warning: z.string().optional(),
});

export type AddSshKey = z.infer<typeof AddSshKeySchema>;
