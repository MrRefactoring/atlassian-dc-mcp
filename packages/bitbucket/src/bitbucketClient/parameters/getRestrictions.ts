import { z } from 'zod';

export const GetRestrictionsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  matcherType: z.enum(['BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional(),
  matcherId: z.string().optional(),
  type: z.enum(['read-only', 'no-deletes', 'fast-forward-only', 'pull-request-only', 'no-creates']).optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRestrictions = z.infer<typeof GetRestrictionsSchema>;
