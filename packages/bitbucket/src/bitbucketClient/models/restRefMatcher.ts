import { z } from 'zod';

export const RestRefMatcherSchema = z.looseObject({
  id: z.string().optional(),
  displayId: z.string().optional(),
  type: z.looseObject({
    id: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
  active: z.boolean().optional(),
});

export type RestRefMatcher = z.infer<typeof RestRefMatcherSchema>;
