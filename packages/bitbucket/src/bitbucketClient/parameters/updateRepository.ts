import { z } from 'zod';
import { RepositorySchema } from '../models/index.js';

export const UpdateRepositorySchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...RepositorySchema.shape,
});

export type UpdateRepository = z.infer<typeof UpdateRepositorySchema>;
