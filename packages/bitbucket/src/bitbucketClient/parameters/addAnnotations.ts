import { z } from 'zod';
import { BulkAddInsightAnnotationRequestSchema } from '../models/index.js';

export const AddAnnotationsSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  key: z.string(),
  ...BulkAddInsightAnnotationRequestSchema.shape,
});

export type AddAnnotations = z.infer<typeof AddAnnotationsSchema>;
