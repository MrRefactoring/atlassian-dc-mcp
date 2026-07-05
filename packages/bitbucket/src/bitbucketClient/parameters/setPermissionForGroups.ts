import { z } from 'zod';

export const SetPermissionForGroupsSchema = z.object({
  projectKey: z.string(),
  name: z.string().optional(),
  permission: z.string().optional(),
});

export type SetPermissionForGroups = z.infer<typeof SetPermissionForGroupsSchema>;
