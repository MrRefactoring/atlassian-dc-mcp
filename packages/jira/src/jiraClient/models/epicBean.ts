import { z } from 'zod';
import { ColorBeanSchema, type ColorBean } from './colorBean.js';

export type EpicBean = {
  color?: ColorBean;
  done?: boolean;
  id?: number;
  key?: string;
  name?: string;
  self?: string;
  summary?: string;
};

export const EpicBeanSchema = z.lazy(() => z.looseObject({
  color: ColorBeanSchema.optional(),
  done: z.boolean().optional(),
  id: z.number().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  summary: z.string().optional(),
})) as unknown as z.ZodType<EpicBean>;
