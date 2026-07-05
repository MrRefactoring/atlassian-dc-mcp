import { z } from 'zod';

export const RestRequiredBuildConditionSchema = z.looseObject({
  id: z.number().optional(),
  buildParentKeys: z.array(z.string()).optional(),
  refMatcher: z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    type: z.looseObject({
      id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    active: z.boolean().optional(),
  }).optional(),
});

export type RestRequiredBuildCondition = z.infer<typeof RestRequiredBuildConditionSchema>;
