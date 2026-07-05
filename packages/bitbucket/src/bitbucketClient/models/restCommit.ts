import { z } from 'zod';

export const RestCommitSchema = z.looseObject({
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
    avatarUrl: z.string().optional(),
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
    avatarUrl: z.string().optional(),
  }).optional(),
  committerTimestamp: z.number().optional(),
  message: z.string().optional(),
  parents: z.array(z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    author: z.looseObject({
      name: z.string().optional(),
      emailAddress: z.string().optional(),
    }).optional(),
    authorTimestamp: z.number().optional(),
    committer: z.looseObject({
      name: z.string().optional(),
      emailAddress: z.string().optional(),
    }).optional(),
    committerTimestamp: z.number().optional(),
    message: z.string().optional(),
    parents: z.array(z.looseObject({
      id: z.string().optional(),
      displayId: z.string().optional(),
    })).optional(),
  })).optional(),
  properties: z.looseObject({
    commentCount: z.number().optional(),
  }).optional(),
});

export type RestCommit = z.infer<typeof RestCommitSchema>;
