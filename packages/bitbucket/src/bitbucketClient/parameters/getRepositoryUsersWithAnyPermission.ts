import { z } from 'zod';

export const GetRepositoryUsersWithAnyPermissionSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  filter: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRepositoryUsersWithAnyPermission = z.infer<typeof GetRepositoryUsersWithAnyPermissionSchema>;
