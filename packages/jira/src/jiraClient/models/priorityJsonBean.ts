import { z } from 'zod';

export type PriorityJsonBean = {
  description?: string;
  iconUrl?: string;
  id?: string;
  name?: string;
  self?: string;
  statusColor?: string;
};

export const PriorityJsonBeanSchema = z.looseObject({
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  statusColor: z.string().optional(),
}) as unknown as z.ZodType<PriorityJsonBean>;
