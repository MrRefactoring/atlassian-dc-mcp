import { z } from 'zod';

export const RestAutoMergeSettingsRequestSchema = z.looseObject({
  enabled: z.boolean().optional(),
});

export type RestAutoMergeSettingsRequest = z.infer<typeof RestAutoMergeSettingsRequestSchema>;
