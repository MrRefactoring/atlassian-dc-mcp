import { z } from 'zod';
import { WebhookSchema } from '../models/index.js';

export const CreateWebhookSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  ...WebhookSchema.shape,
});

export type CreateWebhook = z.infer<typeof CreateWebhookSchema>;
