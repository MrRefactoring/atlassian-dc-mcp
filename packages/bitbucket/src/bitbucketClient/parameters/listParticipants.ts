import { z } from 'zod';

export const ListParticipantsSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type ListParticipants = z.infer<typeof ListParticipantsSchema>;
