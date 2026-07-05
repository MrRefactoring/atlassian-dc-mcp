import { z } from 'zod';
import { FieldsSchema, type Fields } from './fields.js';

export type IssueRefJsonBean = {
    fields?: Fields;
    id?: string;
    key?: string;
    self?: string;
};

export const IssueRefJsonBeanSchema = z.lazy(() => z.looseObject({
  fields: FieldsSchema.optional(),
  id: z.string().optional(),
  key: z.string().optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<IssueRefJsonBean>;
