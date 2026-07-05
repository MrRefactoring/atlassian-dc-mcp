import { z } from 'zod';
import { AutoMergeSettingsRequestSchema } from '../models/index.js';

export const SetAutoMergeSettingsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...AutoMergeSettingsRequestSchema.shape,
});

export type SetAutoMergeSettings = z.infer<typeof SetAutoMergeSettingsSchema>;
