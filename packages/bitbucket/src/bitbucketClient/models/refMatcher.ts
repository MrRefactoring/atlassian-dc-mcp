import { z } from 'zod';

export const RefMatcherSchema = z.looseObject({
  id: z.string().optional(),
  displayId: z.string().optional(),
  type: z.looseObject({
    id: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
  active: z.boolean().optional(),
});

export type RefMatcher = z.infer<typeof RefMatcherSchema>;
