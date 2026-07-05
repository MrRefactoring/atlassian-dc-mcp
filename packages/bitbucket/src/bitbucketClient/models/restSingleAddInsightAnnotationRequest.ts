import { z } from 'zod';

export const RestSingleAddInsightAnnotationRequestSchema = z.looseObject({
  externalId: z.string().optional(),
  line: z.number().optional(),
  link: z.string().optional(),
  message: z.string(),
  path: z.string().optional(),
  severity: z.string(),
  type: z.string().optional(),
});

export type RestSingleAddInsightAnnotationRequest = z.infer<typeof RestSingleAddInsightAnnotationRequestSchema>;
