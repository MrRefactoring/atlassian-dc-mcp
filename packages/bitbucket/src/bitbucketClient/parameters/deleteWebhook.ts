import { z } from 'zod';

export const DeleteWebhookSchema = z.object({
  projectKey: z.string(),
  webhookId: z.string(),
  repositorySlug: z.string(),
});

export type DeleteWebhook = z.infer<typeof DeleteWebhookSchema>;
