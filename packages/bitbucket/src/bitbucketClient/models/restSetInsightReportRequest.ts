import { z } from 'zod';
import { RestInsightReportDataSchema } from './restInsightReportData.js';

export const RestSetInsightReportRequestSchema = z.looseObject({
  coverageProviderKey: z.string().optional(),
  createdDate: z.number().optional(),
  data: z.array(RestInsightReportDataSchema),
  details: z.string().optional(),
  link: z.string().optional(),
  logoUrl: z.string().optional(),
  reporter: z.string().optional(),
  result: z.string().optional(),
  title: z.string(),
});

export type RestSetInsightReportRequest = z.infer<typeof RestSetInsightReportRequestSchema>;
