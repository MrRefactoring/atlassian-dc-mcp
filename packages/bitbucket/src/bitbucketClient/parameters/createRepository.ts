import { z } from 'zod';
import { RepositorySchema } from '../models/index.js';

export const CreateRepositorySchema = z.object({
  projectKey: z.string(),
  ...RepositorySchema.shape,
});

export type CreateRepository = z.infer<typeof CreateRepositorySchema>;
