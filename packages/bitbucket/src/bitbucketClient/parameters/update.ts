import { z } from 'zod';
import { PullRequestSchema } from '../models/index.js';

export const UpdateSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  ...PullRequestSchema.shape,
});

export type Update = z.infer<typeof UpdateSchema>;
