import { z } from 'zod';

export const UnassignParticipantRoleSchema = z.object({
  projectKey: z.string(),
  userSlug: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
});

export type UnassignParticipantRole = z.infer<typeof UnassignParticipantRoleSchema>;
