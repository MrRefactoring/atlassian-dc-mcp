import { z } from 'zod';

export const WatchSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
});

export type Watch = z.infer<typeof WatchSchema>;
