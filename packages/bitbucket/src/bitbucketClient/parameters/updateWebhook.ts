import type { Webhook } from '../models/index.js';

export interface UpdateWebhook {
  projectKey: string;
  webhookId: string;
  repositorySlug: string;
  requestBody?: Webhook;
}
