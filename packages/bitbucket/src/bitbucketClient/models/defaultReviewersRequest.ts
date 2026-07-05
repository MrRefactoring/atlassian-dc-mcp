import { z } from 'zod';
import { ReviewerGroupSchema } from './reviewerGroup.js';
import { ApplicationUserSchema } from './applicationUser.js';

export const DefaultReviewersRequestSchema = z.looseObject({
  requiredApprovals: z.number().optional(),
  reviewerGroups: z.array(ReviewerGroupSchema).optional(),
  reviewers: z.array(ApplicationUserSchema).optional(),
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

export type DefaultReviewersRequest = z.infer<typeof DefaultReviewersRequestSchema>;
