import { z } from 'zod';

export const PullRequestSchema = z.looseObject({
  id: z.number().optional(),
  version: z.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  state: z.string().optional(),
  open: z.boolean().optional(),
  closed: z.boolean().optional(),
  draft: z.boolean().optional(),
  createdDate: z.number().optional(),
  updatedDate: z.number().optional(),
  fromRef: z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    latestCommit: z.string().optional(),
    type: z.string().optional(),
    repository: z.looseObject({
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
    }).optional(),
  }).optional(),
  toRef: z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    latestCommit: z.string().optional(),
    type: z.string().optional(),
    repository: z.looseObject({
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
    }).optional(),
  }).optional(),
  locked: z.boolean().optional(),
  author: z.looseObject({
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
    role: z.string().optional(),
    approved: z.boolean().optional(),
    status: z.string().optional(),
  }).optional(),
  reviewers: z.array(z.unknown()).optional(),
  participants: z.array(z.unknown()).optional(),
  links: z.looseObject({
    self: z.array(z.looseObject({
      href: z.string().optional(),
    })).optional(),
  }).optional(),
  properties: z.looseObject({
    mergeResult: z.looseObject({
      outcome: z.string().optional(),
      current: z.boolean().optional(),
    }).optional(),
    resolvedTaskCount: z.number().optional(),
    commentCount: z.number().optional(),
    openTaskCount: z.number().optional(),
  }).optional(),
});

export type PullRequest = z.infer<typeof PullRequestSchema>;
