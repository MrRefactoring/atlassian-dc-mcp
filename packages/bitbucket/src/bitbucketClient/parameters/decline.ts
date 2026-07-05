import { z } from 'zod';
import { PullRequestDeclineRequestSchema } from '../models/index.js';

export const DeclineSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  version: z.string().optional(),
  ...PullRequestDeclineRequestSchema.omit({ version: true }).shape,
});

export type Decline = z.infer<typeof DeclineSchema>;
