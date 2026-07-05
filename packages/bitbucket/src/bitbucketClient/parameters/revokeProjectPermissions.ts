import { z } from 'zod';

export const RevokeProjectPermissionsSchema = z.object({
  projectKey: z.string(),
  user: z.string().optional(),
  group: z.string().optional(),
});

export type RevokeProjectPermissions = z.infer<typeof RevokeProjectPermissionsSchema>;
