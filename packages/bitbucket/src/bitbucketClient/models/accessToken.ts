import { z } from 'zod';

export const AccessTokenSchema = z.looseObject({
  id: z.string().optional(),
  createdDate: z.number().optional(),
  name: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  user: z.looseObject({
    name: z.string().optional(),
    active: z.boolean().optional(),
    displayName: z.string().optional(),
    id: z.number().optional(),
    slug: z.string().optional(),
    type: z.string().optional(),
    links: z.looseObject({
      self: z.array(z.looseObject({
        href: z.string().optional(),
      })).optional(),
    }).optional(),
  }).optional(),
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;
