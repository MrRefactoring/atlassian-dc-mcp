import { z } from 'zod';

export const RestPullRequestAssignParticipantRoleRequestSchema = z.looseObject({
  role: z.enum(['AUTHOR', 'REVIEWER', 'PARTICIPANT']).optional(),
  user: z.looseObject({
    active: z.boolean().optional(),
    avatarUrl: z.string().optional(),
    displayName: z.string().optional(),
    emailAddress: z.string().optional(),
    id: z.number().optional(),
    links: z.unknown().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    type: z.enum(['NORMAL', 'SERVICE']).optional(),
  }).optional(),
});

export type RestPullRequestAssignParticipantRoleRequest = z.infer<typeof RestPullRequestAssignParticipantRoleRequestSchema>;
