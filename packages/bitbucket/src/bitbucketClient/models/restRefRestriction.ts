import { z } from 'zod';

export const RestRefRestrictionSchema = z.looseObject({
  id: z.number().optional(),
  scope: z.looseObject({
    type: z.string().optional(),
    resourceId: z.number().optional(),
  }).optional(),
  type: z.string().optional(),
  matcher: z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    type: z.looseObject({
      id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    active: z.boolean().optional(),
  }).optional(),
  users: z.array(z.unknown()).optional(),
  groups: z.array(z.unknown()).optional(),
  accessKeys: z.array(z.unknown()).optional(),
});

export type RestRefRestriction = z.infer<typeof RestRefRestrictionSchema>;
