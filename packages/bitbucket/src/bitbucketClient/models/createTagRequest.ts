import { z } from 'zod';

export const CreateTagRequestSchema = z.looseObject({
  message: z.string().optional(),
  name: z.string().optional(),
  startPoint: z.string().optional(),
});

export type CreateTagRequest = z.infer<typeof CreateTagRequestSchema>;
