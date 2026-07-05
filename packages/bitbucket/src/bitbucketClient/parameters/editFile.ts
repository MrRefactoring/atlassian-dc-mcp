import { z } from 'zod';
import { MultipartFormDataSchema } from '../models/index.js';

export const EditFileSchema = z.object({
  path: z.string(),
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...MultipartFormDataSchema.shape,
});

export type EditFile = z.infer<typeof EditFileSchema>;
