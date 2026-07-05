import { z } from 'zod';
import { SshAccessKeySchema } from './sshAccessKey.js';
import { ApplicationUserSchema } from './applicationUser.js';

export const RestrictionRequestSchema = z.looseObject({
  accessKeyIds: z.array(z.number()).optional(),
  accessKeys: z.array(SshAccessKeySchema).optional(),
  groupNames: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  id: z.number().optional(),
  matcher: z.looseObject({
    displayId: z.string().optional(),
    id: z.string().optional(),
    type: z.looseObject({
      id: z.enum(['ANY_REF', 'BRANCH', 'PATTERN', 'MODEL_CATEGORY', 'MODEL_BRANCH']).optional(),
      name: z.string().optional(),
    }).optional(),
  }).optional(),
  scope: z.looseObject({
    resourceId: z.number().optional(),
    type: z.enum(['GLOBAL', 'PROJECT', 'REPOSITORY']).optional(),
  }).optional(),
  type: z.string().optional(),
  userSlugs: z.array(z.string()).optional(),
  users: z.array(ApplicationUserSchema).optional(),
});

export type RestrictionRequest = z.infer<typeof RestrictionRequestSchema>;
