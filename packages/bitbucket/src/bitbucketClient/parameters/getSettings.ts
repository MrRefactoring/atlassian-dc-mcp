import { z } from 'zod';

export const GetSettingsSchema = z.object({
  projectKey: z.string(),
  hookKey: z.string(),
  repositorySlug: z.string(),
});

export type GetSettings = z.infer<typeof GetSettingsSchema>;
