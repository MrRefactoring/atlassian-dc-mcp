import { z } from 'zod';

export const AutoMergeSettingsRequestSchema = z.looseObject({
  enabled: z.boolean().optional(),
});

export type AutoMergeSettingsRequest = z.infer<typeof AutoMergeSettingsRequestSchema>;
