import { z } from 'zod';
import { RequiredBuildConditionSetRequestSchema } from '../models/index.js';

export const UpdateRequiredBuildsMergeCheckSchema = z.object({
  projectKey: z.string(),
  id: z.number(),
  repositorySlug: z.string(),
  ...RequiredBuildConditionSetRequestSchema.shape,
});

export type UpdateRequiredBuildsMergeCheck = z.infer<typeof UpdateRequiredBuildsMergeCheckSchema>;
