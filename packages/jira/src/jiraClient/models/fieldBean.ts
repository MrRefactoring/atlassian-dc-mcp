import { z } from 'zod';
import { JsonTypeBeanSchema, type JsonTypeBean } from './jsonTypeBean.js';

export type FieldBean = {
    clauseNames?: Array<string>;
    custom?: boolean;
    id?: string;
    name?: string;
    navigable?: boolean;
    orderable?: boolean;
    schema?: JsonTypeBean;
    searchable?: boolean;
};

export const FieldBeanSchema = z.lazy(() => z.looseObject({
  clauseNames: z.array(z.string()).optional(),
  custom: z.boolean().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  navigable: z.boolean().optional(),
  orderable: z.boolean().optional(),
  schema: JsonTypeBeanSchema.optional(),
  searchable: z.boolean().optional(),
})) as unknown as z.ZodType<FieldBean>;
