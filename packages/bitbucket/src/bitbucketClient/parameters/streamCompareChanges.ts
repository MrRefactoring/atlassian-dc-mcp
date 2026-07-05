import { z } from 'zod';

export const StreamCompareChangesSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  fromRepo: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type StreamCompareChanges = z.infer<typeof StreamCompareChangesSchema>;
