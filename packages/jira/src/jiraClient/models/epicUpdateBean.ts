import { z } from 'zod';
import { ColorBeanSchema, type ColorBean } from './colorBean.js';

export type EpicUpdateBean = {
  color?: ColorBean;
  done?: boolean;
  name?: string;
  summary?: string;
};

export const EpicUpdateBeanSchema = z.lazy(() => z.looseObject({
  color: ColorBeanSchema.optional(),
  done: z.boolean().optional(),
  name: z.string().optional(),
  summary: z.string().optional(),
})) as unknown as z.ZodType<EpicUpdateBean>;
