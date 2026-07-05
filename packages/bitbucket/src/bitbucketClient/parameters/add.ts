import { z } from 'zod';
import { BuildStatusSetRequestSchema } from '../models/index.js';

export const AddSchema = z.object({
  projectKey: z.string(),
  commitId: z.string(),
  repositorySlug: z.string(),
  ...BuildStatusSetRequestSchema.shape,
});

export type Add = z.infer<typeof AddSchema>;
