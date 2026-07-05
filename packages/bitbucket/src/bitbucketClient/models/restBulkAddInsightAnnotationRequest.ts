import { z } from 'zod';
import { RestSingleAddInsightAnnotationRequestSchema } from './restSingleAddInsightAnnotationRequest.js';

export const RestBulkAddInsightAnnotationRequestSchema = z.looseObject({
  annotations: z.array(RestSingleAddInsightAnnotationRequestSchema).optional(),
});

export type RestBulkAddInsightAnnotationRequest = z.infer<typeof RestBulkAddInsightAnnotationRequestSchema>;
