import { z } from 'zod';

export type NotificationSchemeBean = {
  description?: string;
  expand?: string;
  id?: number;
  name?: string;
  notificationSchemeEvents?: Record<string, any>;
  self?: string;
};

export const NotificationSchemeBeanSchema = z.looseObject({
  description: z.string().optional(),
  expand: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  notificationSchemeEvents: z.record(z.string(), z.any()).optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<NotificationSchemeBean>;
