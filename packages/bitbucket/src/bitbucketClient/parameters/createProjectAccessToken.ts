import { z } from 'zod';
import { AccessTokenRequestSchema } from '../models/index.js';

export const CreateProjectAccessTokenSchema = z.object({
  projectKey: z.string(),
  ...AccessTokenRequestSchema.shape,
});

export type CreateProjectAccessToken = z.infer<typeof CreateProjectAccessTokenSchema>;
