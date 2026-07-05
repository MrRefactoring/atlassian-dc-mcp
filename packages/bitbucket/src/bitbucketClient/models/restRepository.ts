import { z } from 'zod';

export const RestRepositorySchema = z.looseObject({
  slug: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  hierarchyId: z.string().optional(),
  scmId: z.string().optional(),
  state: z.string().optional(),
  statusMessage: z.string().optional(),
  forkable: z.boolean().optional(),
  project: z.looseObject({
    key: z.string().optional(),
    id: z.number().optional(),
    name: z.string().optional(),
    public: z.boolean().optional(),
    type: z.string().optional(),
    links: z.looseObject({
      self: z.array(z.looseObject({
        href: z.string().optional(),
      })).optional(),
    }).optional(),
  }).optional(),
  public: z.boolean().optional(),
  archived: z.boolean().optional(),
  links: z.looseObject({
    clone: z.array(z.looseObject({
      href: z.string().optional(),
      name: z.string().optional(),
    })).optional(),
    self: z.array(z.looseObject({
      href: z.string().optional(),
    })).optional(),
  }).optional(),
});

export type RestRepository = z.infer<typeof RestRepositorySchema>;
