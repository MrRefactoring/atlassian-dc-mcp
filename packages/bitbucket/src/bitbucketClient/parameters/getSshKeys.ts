import { z } from 'zod';

export const GetSshKeysSchema = z.object({
  userName: z.string().optional(),
  user: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetSshKeys = z.infer<typeof GetSshKeysSchema>;
