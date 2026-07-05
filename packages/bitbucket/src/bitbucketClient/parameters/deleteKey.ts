import { z } from 'zod';

export const DeleteKeySchema = z.object({
  fingerprintOrId: z.string(),
});

export type DeleteKey = z.infer<typeof DeleteKeySchema>;
