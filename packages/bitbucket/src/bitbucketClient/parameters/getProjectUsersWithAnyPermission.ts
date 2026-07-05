import { z } from 'zod';

export const GetProjectUsersWithAnyPermissionSchema = z.object({
  projectKey: z.string(),
  filter: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetProjectUsersWithAnyPermission = z.infer<typeof GetProjectUsersWithAnyPermissionSchema>;
