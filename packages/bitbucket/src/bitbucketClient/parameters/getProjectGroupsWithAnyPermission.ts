import { z } from 'zod';

export const GetProjectGroupsWithAnyPermissionSchema = z.object({
  projectKey: z.string(),
  filter: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetProjectGroupsWithAnyPermission = z.infer<typeof GetProjectGroupsWithAnyPermissionSchema>;
