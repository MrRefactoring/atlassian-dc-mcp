import { z } from 'zod';
import { InsightReportDataSchema } from './insightReportData.js';

export const SetInsightReportRequestSchema = z.looseObject({
  coverageProviderKey: z.string().optional(),
  createdDate: z.number().optional(),
  data: z.array(InsightReportDataSchema),
  details: z.string().optional(),
  link: z.string().optional(),
  logoUrl: z.string().optional(),
  reporter: z.string().optional(),
  result: z.string().optional(),
  title: z.string(),
});

export type SetInsightReportRequest = z.infer<typeof SetInsightReportRequestSchema>;
