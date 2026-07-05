import { z } from 'zod';
import { PullRequestReopenRequestSchema } from '../models/index.js';

export const ReopenSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  version: z.string().optional(),
  ...PullRequestReopenRequestSchema.omit({ version: true }).shape,
});

export type Reopen = z.infer<typeof ReopenSchema>;
