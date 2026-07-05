import { z } from 'zod';

export const SetPermissionForGroupSchema = z.object({
  projectKey: z.string(),
  name: z.array(z.string()),
  permission: z.enum(['REPO_READ', 'REPO_WRITE', 'REPO_ADMIN']),
  repositorySlug: z.string(),
});

export type SetPermissionForGroup = z.infer<typeof SetPermissionForGroupSchema>;
