import { z } from 'zod';

export const RestCreateTagRequestSchema = z.looseObject({
  message: z.string().optional(),
  name: z.string().optional(),
  startPoint: z.string().optional(),
});

export type RestCreateTagRequest = z.infer<typeof RestCreateTagRequestSchema>;
