import { z } from 'zod';
import { SettingsSchema } from '../models/index.js';

export const SetSettingsSchema = z.object({
  projectKey: z.string(),
  hookKey: z.string(),
  repositorySlug: z.string(),
  ...SettingsSchema.shape,
});

export type SetSettings = z.infer<typeof SetSettingsSchema>;
