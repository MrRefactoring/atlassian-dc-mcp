import { z } from 'zod';

export const LabelSchema = z.looseObject({
  name: z.string().optional(),
});

export type Label = z.infer<typeof LabelSchema>;
