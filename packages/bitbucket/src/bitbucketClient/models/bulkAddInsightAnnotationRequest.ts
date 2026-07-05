import { z } from 'zod';
import { SingleAddInsightAnnotationRequestSchema } from './singleAddInsightAnnotationRequest.js';

export const BulkAddInsightAnnotationRequestSchema = z.looseObject({
  annotations: z.array(SingleAddInsightAnnotationRequestSchema).optional(),
});

export type BulkAddInsightAnnotationRequest = z.infer<typeof BulkAddInsightAnnotationRequestSchema>;
