import { z } from 'zod';

export const RestPermittedGroupSchema = z.looseObject({
  group: z.looseObject({
    name: z.string().optional(),
  }).optional(),
  permission: z.string().optional(),
});

export type RestPermittedGroup = z.infer<typeof RestPermittedGroupSchema>;
