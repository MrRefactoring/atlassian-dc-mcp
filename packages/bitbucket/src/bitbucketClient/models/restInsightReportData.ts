import { z } from 'zod';

export const RestInsightReportDataSchema = z.looseObject({
  title: z.string().optional(),
  value: z.number().optional(),
  type: z.string().optional(),
});

export type RestInsightReportData = z.infer<typeof RestInsightReportDataSchema>;
