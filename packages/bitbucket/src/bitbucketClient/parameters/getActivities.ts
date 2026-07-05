import { z } from 'zod';

export const GetActivitiesSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
  fromType: z.string().optional(),
  fromId: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetActivities = z.infer<typeof GetActivitiesSchema>;
