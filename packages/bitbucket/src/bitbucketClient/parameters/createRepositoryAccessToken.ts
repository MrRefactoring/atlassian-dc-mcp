import { z } from 'zod';
import { AccessTokenRequestSchema } from '../models/index.js';

export const CreateRepositoryAccessTokenSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...AccessTokenRequestSchema.shape,
});

export type CreateRepositoryAccessToken = z.infer<typeof CreateRepositoryAccessTokenSchema>;
