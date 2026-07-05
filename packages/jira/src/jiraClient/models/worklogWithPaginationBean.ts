import { z } from 'zod';
import { worklogSchema, type worklog } from './worklog.js';

export type WorklogWithPaginationBean = {
    maxResults?: number;
    startAt?: number;
    total?: number;
    worklogs?: Array<worklog>;
};

export const WorklogWithPaginationBeanSchema = z.lazy(() => z.looseObject({
  maxResults: z.number().optional(),
  startAt: z.number().optional(),
  total: z.number().optional(),
  worklogs: z.array(worklogSchema).optional(),
})) as unknown as z.ZodType<WorklogWithPaginationBean>;
