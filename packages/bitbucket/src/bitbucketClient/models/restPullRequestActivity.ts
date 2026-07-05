import { z } from 'zod';

export const RestPullRequestActivitySchema = z.looseObject({
  id: z.number().optional(),
  createdDate: z.number().optional(),
  user: z.looseObject({
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
  action: z.string().optional(),
  commentAction: z.string().optional(),
  comment: z.looseObject({
    properties: z.looseObject({
      repositoryId: z.number().optional(),
    }).optional(),
    id: z.number().optional(),
    version: z.number().optional(),
    text: z.string().optional(),
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
    createdDate: z.number().optional(),
    updatedDate: z.number().optional(),
    comments: z.array(z.unknown()).optional(),
    threadResolved: z.boolean().optional(),
    severity: z.string().optional(),
    state: z.string().optional(),
    permittedOperations: z.looseObject({
      editable: z.boolean().optional(),
      transitionable: z.boolean().optional(),
      deletable: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

export type RestPullRequestActivity = z.infer<typeof RestPullRequestActivitySchema>;
