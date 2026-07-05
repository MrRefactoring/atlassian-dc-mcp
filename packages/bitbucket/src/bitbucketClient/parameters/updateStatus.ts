import { z } from 'zod';
import { PullRequestAssignStatusRequestSchema } from '../models/index.js';

export const UpdateStatusSchema = z.object({
  projectKey: z.string(),
  userSlug: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  version: z.string().optional(),
  ...PullRequestAssignStatusRequestSchema.shape,
});

export type UpdateStatus = z.infer<typeof UpdateStatusSchema>;
