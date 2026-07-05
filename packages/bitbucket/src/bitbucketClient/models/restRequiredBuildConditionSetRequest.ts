import { z } from 'zod';
import { RestRefMatcherSchema } from './restRefMatcher.js';

export const RestRequiredBuildConditionSetRequestSchema = z.looseObject({
  buildParentKeys: z.array(z.string()),
  exemptRefMatcher: z.looseObject({
    displayId: z.string().optional(),
    id: z.string().optional(),
    type: z.looseObject({
      id: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional(),
      name: z.string().optional(),
    }).optional(),
  }).optional(),
  refMatcher: RestRefMatcherSchema,
});

export type RestRequiredBuildConditionSetRequest = z.infer<typeof RestRequiredBuildConditionSetRequestSchema>;
