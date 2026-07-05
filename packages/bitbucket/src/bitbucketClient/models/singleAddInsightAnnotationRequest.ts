import { z } from 'zod';

export const SingleAddInsightAnnotationRequestSchema = z.looseObject({
  externalId: z.string().optional(),
  line: z.number().optional(),
  link: z.string().optional(),
  message: z.string(),
  path: z.string().optional(),
  severity: z.string(),
  type: z.string().optional(),
});

export type SingleAddInsightAnnotationRequest = z.infer<typeof SingleAddInsightAnnotationRequestSchema>;
