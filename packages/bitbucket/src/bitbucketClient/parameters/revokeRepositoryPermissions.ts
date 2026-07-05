import { z } from 'zod';

export const RevokeRepositoryPermissionsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  user: z.string().optional(),
  group: z.string().optional(),
});

export type RevokeRepositoryPermissions = z.infer<typeof RevokeRepositoryPermissionsSchema>;
