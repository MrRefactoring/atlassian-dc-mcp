import { z } from 'zod';

export const UnwatchSchema = z.object({
  projectKey: z.string(),
  pullRequestId: z.string(),
  repositorySlug: z.string(),
});

export type Unwatch = z.infer<typeof UnwatchSchema>;
