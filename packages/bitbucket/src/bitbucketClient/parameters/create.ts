import { z } from 'zod';
import { PullRequestSchema } from '../models/index.js';

export const CreateSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...PullRequestSchema.shape,
});

export type Create = z.infer<typeof CreateSchema>;
