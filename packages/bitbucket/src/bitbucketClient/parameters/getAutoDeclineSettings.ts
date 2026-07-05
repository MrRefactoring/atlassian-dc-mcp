import { z } from 'zod';

export const GetAutoDeclineSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
});

export type GetAutoDeclineSettings = z.infer<typeof GetAutoDeclineSettingsSchema>;
