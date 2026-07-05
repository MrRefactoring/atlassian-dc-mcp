import { z } from 'zod';

export type PropertyBean = {
    id?: string;
    key?: string;
    value?: string;
};

export const PropertyBeanSchema = z.looseObject({
  id: z.string().optional(),
  key: z.string().optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<PropertyBean>;
