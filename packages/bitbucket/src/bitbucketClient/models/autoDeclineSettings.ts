import { z } from 'zod';

export const AutoDeclineSettingsSchema = z.looseObject({
  enabled: z.boolean().optional(),
  inactivityWeeks: z.number().optional(),
  scope: z.looseObject({
    type: z.string().optional(),
  }).optional(),
});

export type AutoDeclineSettings = z.infer<typeof AutoDeclineSettingsSchema>;
