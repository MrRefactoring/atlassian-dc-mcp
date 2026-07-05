import { z } from 'zod';

export const SetPermissionForUsersSchema = z.object({
  projectKey: z.string(),
  name: z.string().optional(),
  permission: z.string().optional(),
});

export type SetPermissionForUsers = z.infer<typeof SetPermissionForUsersSchema>;
