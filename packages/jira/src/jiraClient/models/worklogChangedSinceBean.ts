import { z } from 'zod';
import { WorklogChangeBeanSchema, type WorklogChangeBean } from './worklogChangeBean.js';

export type WorklogChangedSinceBean = {
    isLastPage?: boolean;
    lastPage?: boolean;
    nextPage?: string;
    self?: string;
    since?: number;
    until?: number;
    values?: Array<WorklogChangeBean>;
};

export const WorklogChangedSinceBeanSchema = z.lazy(() => z.looseObject({
  isLastPage: z.boolean().optional(),
  lastPage: z.boolean().optional(),
  nextPage: z.string().optional(),
  self: z.string().optional(),
  since: z.number().optional(),
  until: z.number().optional(),
  values: z.array(WorklogChangeBeanSchema).optional(),
})) as unknown as z.ZodType<WorklogChangedSinceBean>;
