import { z } from 'zod';
import { PullRequestAssignParticipantRoleRequestSchema } from '../models/index.js';

export const AssignParticipantRoleSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  ...PullRequestAssignParticipantRoleRequestSchema.shape,
});

export type AssignParticipantRole = z.infer<typeof AssignParticipantRoleSchema>;
