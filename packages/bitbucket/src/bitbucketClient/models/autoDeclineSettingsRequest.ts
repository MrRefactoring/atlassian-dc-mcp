import { z } from 'zod';

export const AutoDeclineSettingsRequestSchema = z.looseObject({
  enabled: z.boolean().optional(),
  inactivityWeeks: z.number().optional(),
});

export type AutoDeclineSettingsRequest = z.infer<typeof AutoDeclineSettingsRequestSchema>;
