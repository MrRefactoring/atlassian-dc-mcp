import { z } from 'zod';
import { RestSshKeySchema } from './restSshKey.js';

export const RestSshAccessKeySchema = z.looseObject({
  key: RestSshKeySchema.optional(),
  permission: z.string().optional(),
  project: z.looseObject({}).optional(),
  repository: z.looseObject({}).optional(),
});

export type RestSshAccessKey = z.infer<typeof RestSshAccessKeySchema>;
