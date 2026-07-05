import { z } from 'zod';

export const FindWebhooksSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  event: z.string().optional(),
  statistics: z.boolean().optional(),
});

export type FindWebhooks = z.infer<typeof FindWebhooksSchema>;
