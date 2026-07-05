import { z } from 'zod';
import { WebhookSchema } from '../models/index.js';

export const UpdateWebhookSchema = z.object({
  projectKey: z.string(),
  webhookId: z.string(),
  repositorySlug: z.string(),
  ...WebhookSchema.shape,
});

export type UpdateWebhook = z.infer<typeof UpdateWebhookSchema>;
