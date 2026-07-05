import { z } from 'zod';

export const GetPullRequestSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type GetPullRequestSettings = z.infer<typeof GetPullRequestSettingsSchema>;
