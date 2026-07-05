import { z } from 'zod';

export const WebhookSchema = z.looseObject({
  id: z.number().optional(),
  name: z.string().optional(),
  createdDate: z.number().optional(),
  updatedDate: z.number().optional(),
  events: z.array(z.string()).optional(),
  configuration: z.looseObject({}).optional(),
  url: z.string().optional(),
  active: z.boolean().optional(),
  scopeType: z.string().optional(),
  sslVerificationRequired: z.boolean().optional(),
});

export type Webhook = z.infer<typeof WebhookSchema>;
