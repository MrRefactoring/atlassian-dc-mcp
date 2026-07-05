import { z } from 'zod';
import { StatusCategoryJsonBeanSchema, type StatusCategoryJsonBean } from './statusCategoryJsonBean.js';

export type StatusJsonBean = {
  description?: string;
  iconUrl?: string;
  id?: string;
  name?: string;
  self?: string;
  statusCategory?: StatusCategoryJsonBean;
  statusColor?: string;
};

export const StatusJsonBeanSchema = z.lazy(() => z.looseObject({
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  statusCategory: StatusCategoryJsonBeanSchema.optional(),
  statusColor: z.string().optional(),
})) as unknown as z.ZodType<StatusJsonBean>;
