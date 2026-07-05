import { z } from 'zod';
import { RestSshAccessKeySchema } from './restSshAccessKey.js';
import { RestApplicationUserSchema } from './restApplicationUser.js';

export const RestRestrictionRequestSchema = z.looseObject({
  accessKeyIds: z.array(z.number()).optional(),
  accessKeys: z.array(RestSshAccessKeySchema).optional(),
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
  users: z.array(RestApplicationUserSchema).optional(),
});

export type RestRestrictionRequest = z.infer<typeof RestRestrictionRequestSchema>;
