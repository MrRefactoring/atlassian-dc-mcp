import { z } from 'zod';

export const RestApplicationUserSchema = z.looseObject({
  name: z.string().optional(),
  emailAddress: z.string().optional(),
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
  avatarUrl: z.string().optional(),
});

export type RestApplicationUser = z.infer<typeof RestApplicationUserSchema>;
