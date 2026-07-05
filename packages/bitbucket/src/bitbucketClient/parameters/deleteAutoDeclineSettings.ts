import { z } from 'zod';

export const DeleteAutoDeclineSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type DeleteAutoDeclineSettings = z.infer<typeof DeleteAutoDeclineSettingsSchema>;
