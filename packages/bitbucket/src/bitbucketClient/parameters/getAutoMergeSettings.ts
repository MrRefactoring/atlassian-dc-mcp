import { z } from 'zod';

export const GetAutoMergeSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type GetAutoMergeSettings = z.infer<typeof GetAutoMergeSettingsSchema>;
