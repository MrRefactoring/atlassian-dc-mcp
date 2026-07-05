import { z } from 'zod';
import { RestrictJsonBeanSchema, type RestrictJsonBean } from './restrictJsonBean.js';
import { ToJsonBeanSchema, type ToJsonBean } from './toJsonBean.js';

export type NotificationJsonBean = {
    htmlBody?: string;
    restrict?: RestrictJsonBean;
    subject?: string;
    textBody?: string;
    to?: ToJsonBean;
};

export const NotificationJsonBeanSchema = z.lazy(() => z.looseObject({
  htmlBody: z.string().optional(),
  restrict: RestrictJsonBeanSchema.optional(),
  subject: z.string().optional(),
  textBody: z.string().optional(),
  to: ToJsonBeanSchema.optional(),
})) as unknown as z.ZodType<NotificationJsonBean>;
