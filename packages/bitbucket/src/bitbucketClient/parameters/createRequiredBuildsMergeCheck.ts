import { z } from 'zod';
import { RequiredBuildConditionSetRequestSchema } from '../models/index.js';

export const CreateRequiredBuildsMergeCheckSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...RequiredBuildConditionSetRequestSchema.shape,
});

export type CreateRequiredBuildsMergeCheck = z.infer<typeof CreateRequiredBuildsMergeCheckSchema>;
