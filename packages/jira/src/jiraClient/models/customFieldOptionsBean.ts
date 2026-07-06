import { z } from 'zod';
import { CustomFieldOptionBeanSchema, type CustomFieldOptionBean } from './customFieldOptionBean.js';

export type CustomFieldOptionsBean = {
  options?: Array<CustomFieldOptionBean>;
  total?: number;
};

export const CustomFieldOptionsBeanSchema = z.lazy(() => z.looseObject({
  options: z.array(CustomFieldOptionBeanSchema).optional(),
  total: z.number().optional(),
})) as unknown as z.ZodType<CustomFieldOptionsBean>;
