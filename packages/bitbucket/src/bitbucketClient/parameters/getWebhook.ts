import { z } from 'zod';

export const GetWebhookSchema = z.object({
  projectKey: z.string(),
  webhookId: z.string(),
  repositorySlug: z.string(),
  statistics: z.string().optional(),
});

export type GetWebhook = z.infer<typeof GetWebhookSchema>;
