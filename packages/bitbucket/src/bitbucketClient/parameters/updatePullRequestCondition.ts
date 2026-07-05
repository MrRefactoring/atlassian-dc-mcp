import { z } from 'zod';
import { ApplicationUserSchema, ReviewerGroupSchema } from '../models/index.js';

export const UpdatePullRequestConditionSchema = z.object({
  projectKey: z.string(),
  id: z.string(),
  repositorySlug: z.string(),
  requiredApprovals: z.number().optional(),
  reviewerGroups: z.array(ReviewerGroupSchema).optional(),
  reviewers: z.array(ApplicationUserSchema).optional(),
  sourceMatcher: z.object({ displayId: z.string().optional(), id: z.string().optional(), type: z.object({ id: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional(), name: z.string().optional() }).optional() }).optional(),
  targetMatcher: z.object({ displayId: z.string().optional(), id: z.string().optional(), type: z.object({ id: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional(), name: z.string().optional() }).optional() }).optional(),
});

export type UpdatePullRequestCondition = z.infer<typeof UpdatePullRequestConditionSchema>;
