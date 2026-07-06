import { z } from 'zod';
import { DashboardBeanSchema, type DashboardBean } from './dashboardBean.js';

export type DashboardsBean = {
  dashboards?: Array<DashboardBean>;
  maxResults?: number;
  next?: string;
  prev?: string;
  startAt?: number;
  total?: number;
};

export const DashboardsBeanSchema = z.lazy(() => z.looseObject({
  dashboards: z.array(DashboardBeanSchema).optional(),
  maxResults: z.number().optional(),
  next: z.string().optional(),
  prev: z.string().optional(),
  startAt: z.number().optional(),
  total: z.number().optional(),
})) as unknown as z.ZodType<DashboardsBean>;
