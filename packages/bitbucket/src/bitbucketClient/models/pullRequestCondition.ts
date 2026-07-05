import { z } from 'zod';

export const PullRequestConditionSchema = z.looseObject({
  id: z.number().optional(),
  scope: z.looseObject({
    type: z.string().optional(),
    resourceId: z.number().optional(),
  }).optional(),
  sourceRefMatcher: z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    type: z.looseObject({
      id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    active: z.boolean().optional(),
  }).optional(),
  targetRefMatcher: z.looseObject({
    id: z.string().optional(),
    displayId: z.string().optional(),
    type: z.looseObject({
      id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    active: z.boolean().optional(),
  }).optional(),
  reviewers: z.array(z.looseObject({
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
  })).optional(),
  requiredApprovals: z.number().optional(),
  name: z.string().optional(),
  emailAddress: z.string().optional(),
  active: z.boolean().optional(),
  displayName: z.string().optional(),
  slug: z.string().optional(),
  type: z.string().optional(),
  links: z.looseObject({
    self: z.array(z.looseObject({
      href: z.string().optional(),
    })).optional(),
  }).optional(),
});

export type PullRequestCondition = z.infer<typeof PullRequestConditionSchema>;
