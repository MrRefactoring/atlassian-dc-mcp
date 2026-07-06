import { z } from 'zod';

export type CustomFieldOptionBean = {
  childrenIds?: Array<number>;
  disabled?: boolean;
  id?: number;
  self?: string;
  value?: string;
};

export const CustomFieldOptionBeanSchema = z.looseObject({
  childrenIds: z.array(z.number()).optional(),
  disabled: z.boolean().optional(),
  id: z.number().optional(),
  self: z.string().optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<CustomFieldOptionBean>;
