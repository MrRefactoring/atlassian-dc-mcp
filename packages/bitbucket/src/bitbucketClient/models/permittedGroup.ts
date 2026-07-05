import { z } from 'zod';

export const PermittedGroupSchema = z.looseObject({
  group: z.looseObject({
    name: z.string().optional(),
  }).optional(),
  permission: z.string().optional(),
});

export type PermittedGroup = z.infer<typeof PermittedGroupSchema>;
