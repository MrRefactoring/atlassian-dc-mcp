import { z } from 'zod';

export const DeleteSshKeySchema = z.object({
  keyId: z.string(),
});

export type DeleteSshKey = z.infer<typeof DeleteSshKeySchema>;
