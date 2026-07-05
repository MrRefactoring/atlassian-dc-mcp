import { z } from 'zod';

export const RestBuildStatusSchema = z.looseObject({
  createdDate: z.number().optional(),
  dateAdded: z.number().optional(),
  description: z.string().optional(),
  key: z.string().optional(),
  state: z.string().optional(),
  updatedDate: z.number().optional(),
  url: z.string().optional(),
  buildNumber: z.string().optional(),
  commit: z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    author: z.looseObject({
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
    }).optional(),
    authorTimestamp: z.number().optional(),
    committer: z.looseObject({
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
    }).optional(),
    committerTimestamp: z.number().optional(),
    message: z.string().optional(),
    parents: z.array(z.looseObject({
      id: z.string().optional(),
      displayId: z.string().optional(),
    })).optional(),
  }).optional(),
});

export type RestBuildStatus = z.infer<typeof RestBuildStatusSchema>;
