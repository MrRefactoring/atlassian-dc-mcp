import type { Webhook } from '../models/index.js';

export interface CreateWebhook {
  projectKey: string;
  repositorySlug: string;
  requestBody?: Webhook;
}
