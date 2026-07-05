import { z } from 'zod';
import { RepositoryPullRequestSettingsSchema } from '../models/index.js';

export const UpdatePullRequestSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...RepositoryPullRequestSettingsSchema.shape,
});

export type UpdatePullRequestSettings = z.infer<typeof UpdatePullRequestSettingsSchema>;
