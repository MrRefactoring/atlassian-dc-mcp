import { z } from 'zod';
import { FieldMetaBeanSchema, type FieldMetaBean } from './fieldMetaBean.js';
import { StatusJsonBeanSchema, type StatusJsonBean } from './statusJsonBean.js';

export type TransitionBean = {
    description?: string;
    fields?: Record<string, FieldMetaBean>;
    id?: string;
    name?: string;
    opsbarSequence?: number;
    to?: StatusJsonBean;
};

export const TransitionBeanSchema = z.lazy(() => z.looseObject({
  description: z.string().optional(),
  fields: z.record(z.string(), FieldMetaBeanSchema).optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  opsbarSequence: z.number().optional(),
  to: StatusJsonBeanSchema.optional(),
})) as unknown as z.ZodType<TransitionBean>;
