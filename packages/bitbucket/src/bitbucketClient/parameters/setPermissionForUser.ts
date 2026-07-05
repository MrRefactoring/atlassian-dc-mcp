import { z } from 'zod';

export const SetPermissionForUserSchema = z.object({
  projectKey: z.string(),
  name: z.array(z.string()),
  permission: z.enum(['REPO_READ', 'REPO_WRITE', 'REPO_ADMIN']),
  repositorySlug: z.string(),
});

export type SetPermissionForUser = z.infer<typeof SetPermissionForUserSchema>;
