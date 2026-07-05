import { z } from 'zod';
import { JsonTypeBeanSchema, type JsonTypeBean } from './jsonTypeBean.js';

export type FieldMetaBean = {
    allowedValues?: Array<Record<string, any>>;
    autoCompleteUrl?: string;
    defaultValue?: Record<string, any>;
    fieldId?: string;
    hasDefaultValue?: boolean;
    name?: string;
    operations?: Array<string>;
    required?: boolean;
    schema?: JsonTypeBean;
};

export const FieldMetaBeanSchema = z.lazy(() => z.looseObject({
  allowedValues: z.array(z.record(z.string(), z.any())).optional(),
  autoCompleteUrl: z.string().optional(),
  defaultValue: z.record(z.string(), z.any()).optional(),
  fieldId: z.string().optional(),
  hasDefaultValue: z.boolean().optional(),
  name: z.string().optional(),
  operations: z.array(z.string()).optional(),
  required: z.boolean().optional(),
  schema: JsonTypeBeanSchema.optional(),
})) as unknown as z.ZodType<FieldMetaBean>;
