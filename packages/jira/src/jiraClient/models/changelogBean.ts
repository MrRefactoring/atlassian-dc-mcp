import { z } from 'zod';
import { ChangeHistoryBeanSchema, type ChangeHistoryBean } from './changeHistoryBean.js';

export type ChangelogBean = {
    histories?: Array<ChangeHistoryBean>;
    maxResults?: number;
    startAt?: number;
    total?: number;
};

export const ChangelogBeanSchema = z.lazy(() => z.looseObject({
  histories: z.array(ChangeHistoryBeanSchema).optional(),
  maxResults: z.number().optional(),
  startAt: z.number().optional(),
  total: z.number().optional(),
})) as unknown as z.ZodType<ChangelogBean>;
