import { z } from 'zod';
import { RelationBeanSchema, type RelationBean } from './relationBean.js';

export type ColumnBean = {
  max?: number;
  min?: number;
  name?: string;
  statuses?: Array<RelationBean>;
};

export const ColumnBeanSchema = z.lazy(() => z.looseObject({
  max: z.number().optional(),
  min: z.number().optional(),
  name: z.string().optional(),
  statuses: z.array(RelationBeanSchema).optional(),
})) as unknown as z.ZodType<ColumnBean>;
