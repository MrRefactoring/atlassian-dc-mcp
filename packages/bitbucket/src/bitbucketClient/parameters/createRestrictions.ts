import { z } from 'zod';
import { RestrictionRequestSchema } from '../models/index.js';

export const CreateRestrictionsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  restrictions: z.array(RestrictionRequestSchema),
});

export type CreateRestrictions = z.infer<typeof CreateRestrictionsSchema>;
