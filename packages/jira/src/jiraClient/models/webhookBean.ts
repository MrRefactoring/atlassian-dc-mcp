import { z } from 'zod';

export type WebhookBean = {
  name?: string;
  url?: string;
  events?: Array<string>;
  filters?: Record<string, any>;
  excludeBody?: boolean;
  enabled?: boolean;
  self?: string;
  lastUpdatedUser?: string;
  lastUpdatedDisplayName?: string;
  lastUpdated?: number;
};

export const WebhookBeanSchema = z.looseObject({
  name: z.string().optional(),
  url: z.string().optional(),
  events: z.array(z.string()).optional(),
  filters: z.record(z.string(), z.any()).optional(),
  excludeBody: z.boolean().optional(),
  enabled: z.boolean().optional(),
  self: z.string().optional(),
  lastUpdatedUser: z.string().optional(),
  lastUpdatedDisplayName: z.string().optional(),
  lastUpdated: z.number().optional(),
}) as unknown as z.ZodType<WebhookBean>;
