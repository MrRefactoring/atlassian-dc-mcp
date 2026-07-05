import { z } from 'zod';
import { ColumnBeanSchema, type ColumnBean } from './columnBean.js';

export type ColumnConfigBean = {
  columns?: Array<ColumnBean>;
  constraintType?: string;
};

export const ColumnConfigBeanSchema = z.lazy(() => z.looseObject({
  columns: z.array(ColumnBeanSchema).optional(),
  constraintType: z.string().optional(),
})) as unknown as z.ZodType<ColumnConfigBean>;
