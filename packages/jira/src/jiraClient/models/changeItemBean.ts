import { z } from 'zod';

export type ChangeItemBean = {
  field?: string;
  fieldtype?: string;
  from?: string;
  fromString?: string;
  to?: string;
  toString?: string;
};

export const ChangeItemBeanSchema = z.looseObject({
  field: z.string().optional(),
  fieldtype: z.string().optional(),
  from: z.string().optional(),
  fromString: z.string().optional(),
  to: z.string().optional(),
  toString: z.string().optional(),
}) as unknown as z.ZodType<ChangeItemBean>;
