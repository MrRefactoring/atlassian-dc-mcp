import { z } from 'zod';

export const GetKeysForUserSchema = z.object({
  user: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetKeysForUser = z.infer<typeof GetKeysForUserSchema>;
