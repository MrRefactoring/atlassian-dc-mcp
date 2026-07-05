import { z } from 'zod';

export const GetRepositoryGroupsWithAnyPermissionSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  filter: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRepositoryGroupsWithAnyPermission = z.infer<typeof GetRepositoryGroupsWithAnyPermissionSchema>;
