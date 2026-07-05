import { z } from 'zod';
import { RestReviewerGroupSchema } from './restReviewerGroup.js';
import { RestApplicationUserSchema } from './restApplicationUser.js';

export const RestDefaultReviewersRequestSchema = z.looseObject({
  requiredApprovals: z.number().optional(),
  reviewerGroups: z.array(RestReviewerGroupSchema).optional(),
  reviewers: z.array(RestApplicationUserSchema).optional(),
  sourceMatcher: z.looseObject({
    displayId: z.string().optional(),
    id: z.string().optional(),
    type: z.looseObject({
      id: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional(),
      name: z.string().optional(),
    }).optional(),
  }).optional(),
  targetMatcher: z.looseObject({
    displayId: z.string().optional(),
    id: z.string().optional(),
    type: z.looseObject({
      id: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional(),
      name: z.string().optional(),
    }).optional(),
  }).optional(),
});

export type RestDefaultReviewersRequest = z.infer<typeof RestDefaultReviewersRequestSchema>;
