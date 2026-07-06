import { z } from 'zod';

export type StatusCategoryJsonBean = {
  colorName?: string;
  id?: number;
  key?: string;
  name?: string;
  self?: string;
};

export const StatusCategoryJsonBeanSchema = z.looseObject({
  colorName: z.string().optional(),
  id: z.number().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<StatusCategoryJsonBean>;
