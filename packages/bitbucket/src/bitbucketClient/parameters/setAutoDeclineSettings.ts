import { z } from 'zod';
import { AutoDeclineSettingsRequestSchema } from '../models/index.js';

export const SetAutoDeclineSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...AutoDeclineSettingsRequestSchema.shape,
});

export type SetAutoDeclineSettings = z.infer<typeof SetAutoDeclineSettingsSchema>;
