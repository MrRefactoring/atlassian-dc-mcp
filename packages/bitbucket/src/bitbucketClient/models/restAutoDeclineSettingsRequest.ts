import { z } from 'zod';

export const RestAutoDeclineSettingsRequestSchema = z.looseObject({
  enabled: z.boolean().optional(),
  inactivityWeeks: z.number().optional(),
});

export type RestAutoDeclineSettingsRequest = z.infer<typeof RestAutoDeclineSettingsRequestSchema>;
