import { z } from 'zod';

export const RestAutoMergeRestrictedSettingsSchema = z.looseObject({
  enabled: z.boolean().optional(),
  scope: z.looseObject({
    type: z.string().optional(),
  }).optional(),
  restrictionState: z.string().optional(),
});

export type RestAutoMergeRestrictedSettings = z.infer<typeof RestAutoMergeRestrictedSettingsSchema>;
