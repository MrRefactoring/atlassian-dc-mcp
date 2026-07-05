import { z } from 'zod';

export const RestInsightAnnotationsResponseSchema = z.looseObject({
  totalCount: z.number().optional(),
  annotations: z.array(z.looseObject({
    reportKey: z.string().optional(),
    line: z.number().optional(),
    message: z.string().optional(),
    path: z.string().optional(),
    severity: z.string().optional(),
    type: z.string().optional(),
  })).optional(),
});

export type RestInsightAnnotationsResponse = z.infer<typeof RestInsightAnnotationsResponseSchema>;
