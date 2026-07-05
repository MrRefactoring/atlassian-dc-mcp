import { z } from 'zod';
import { RepositorySchema } from '../models/index.js';

export const ForkRepositorySchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...RepositorySchema.shape,
});

export type ForkRepository = z.infer<typeof ForkRepositorySchema>;
