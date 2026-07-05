import { z } from 'zod';

export const InsightReportDataSchema = z.looseObject({
  title: z.string().optional(),
  value: z.number().optional(),
  type: z.string().optional(),
});

export type InsightReportData = z.infer<typeof InsightReportDataSchema>;
