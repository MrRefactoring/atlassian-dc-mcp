import { z } from 'zod';
import { PrioritySchemeBeanSchema, type PrioritySchemeBean } from './prioritySchemeBean.js';

export type PrioritySchemeListBean = {
  maxResults?: number;
  schemes?: Array<PrioritySchemeBean>;
  startAt?: number;
  total?: number;
};

export const PrioritySchemeListBeanSchema = z.lazy(() => z.looseObject({
  maxResults: z.number().optional(),
  schemes: z.array(PrioritySchemeBeanSchema).optional(),
  startAt: z.number().optional(),
  total: z.number().optional(),
})) as unknown as z.ZodType<PrioritySchemeListBean>;
