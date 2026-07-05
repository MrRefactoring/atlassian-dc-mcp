import { z } from 'zod';
import { SshKeySchema } from './sshKey.js';

export const SshAccessKeySchema = z.looseObject({
  key: SshKeySchema.optional(),
  permission: z.string().optional(),
  project: z.looseObject({}).optional(),
  repository: z.looseObject({}).optional(),
});

export type SshAccessKey = z.infer<typeof SshAccessKeySchema>;
