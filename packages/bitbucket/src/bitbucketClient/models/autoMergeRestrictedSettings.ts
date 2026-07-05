import { z } from 'zod';

export const AutoMergeRestrictedSettingsSchema = z.looseObject({
  enabled: z.boolean().optional(),
  scope: z.looseObject({
    type: z.string().optional(),
  }).optional(),
  restrictionState: z.string().optional(),
});

export type AutoMergeRestrictedSettings = z.infer<typeof AutoMergeRestrictedSettingsSchema>;
