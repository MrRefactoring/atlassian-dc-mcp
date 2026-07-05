import { z } from 'zod';

export const RestPullRequestParticipantSchema = z.looseObject({
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
});

export type RestPullRequestParticipant = z.infer<typeof RestPullRequestParticipantSchema>;
