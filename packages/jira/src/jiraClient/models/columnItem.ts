import { z } from 'zod';

export type ColumnItem = {
  label?: string;
  value?: string;
};

export const ColumnItemSchema = z.looseObject({
  label: z.string().optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<ColumnItem>;
