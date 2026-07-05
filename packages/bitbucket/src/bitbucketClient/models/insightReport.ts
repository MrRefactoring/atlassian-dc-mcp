import { z } from 'zod';

export const InsightReportSchema = z.looseObject({
  data: z.array(z.looseObject({
    title: z.string().optional(),
    value: z.number().optional(),
    type: z.string().optional(),
  })).optional(),
  createdDate: z.number().optional(),
  details: z.string().optional(),
  key: z.string().optional(),
  result: z.string().optional(),
  title: z.string().optional(),
});

export type InsightReport = z.infer<typeof InsightReportSchema>;
