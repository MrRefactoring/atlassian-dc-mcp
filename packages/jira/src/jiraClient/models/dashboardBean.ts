import { z } from 'zod';

export type DashboardBean = {
    id?: string;
    name?: string;
    self?: string;
    view?: string;
};

export const DashboardBeanSchema = z.looseObject({
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  view: z.string().optional(),
}) as unknown as z.ZodType<DashboardBean>;
