import { z } from 'zod';

export const GetRestrictionSchema = z.object({
  projectKey: z.string(),
  id: z.string(),
  repositorySlug: z.string(),
});

export type GetRestriction = z.infer<typeof GetRestrictionSchema>;
