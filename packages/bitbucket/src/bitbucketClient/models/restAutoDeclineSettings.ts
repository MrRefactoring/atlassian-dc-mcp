import { z } from 'zod';

export const RestAutoDeclineSettingsSchema = z.looseObject({
  enabled: z.boolean().optional(),
  inactivityWeeks: z.number().optional(),
  scope: z.looseObject({
    type: z.string().optional(),
  }).optional(),
});

export type RestAutoDeclineSettings = z.infer<typeof RestAutoDeclineSettingsSchema>;
