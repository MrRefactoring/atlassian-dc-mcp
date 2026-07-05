import { z } from 'zod';
import { CreateTagRequestSchema } from '../models/index.js';

export const CreateTagForRepositorySchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...CreateTagRequestSchema.shape,
});

export type CreateTagForRepository = z.infer<typeof CreateTagForRepositorySchema>;
