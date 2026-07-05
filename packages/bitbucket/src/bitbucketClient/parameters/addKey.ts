import { z } from 'zod';
import { GpgKeySchema } from '../models/index.js';

export const AddKeySchema = z.object({
  user: z.string().optional(),
  ...GpgKeySchema.shape,
});

export type AddKey = z.infer<typeof AddKeySchema>;
