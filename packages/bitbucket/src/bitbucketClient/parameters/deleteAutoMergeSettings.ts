import { z } from 'zod';

export const DeleteAutoMergeSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type DeleteAutoMergeSettings = z.infer<typeof DeleteAutoMergeSettingsSchema>;
