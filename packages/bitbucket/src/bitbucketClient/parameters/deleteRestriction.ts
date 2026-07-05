import { z } from 'zod';

export const DeleteRestrictionSchema = z.object({
  projectKey: z.string(),
  id: z.string(),
  repositorySlug: z.string(),
});

export type DeleteRestriction = z.infer<typeof DeleteRestrictionSchema>;
