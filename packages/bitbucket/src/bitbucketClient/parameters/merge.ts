import { z } from 'zod';
import { PullRequestMergeRequestSchema } from '../models/index.js';

export const MergeSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  version: z.string().optional(),
  ...PullRequestMergeRequestSchema.omit({ version: true }).shape,
});

export type Merge = z.infer<typeof MergeSchema>;
