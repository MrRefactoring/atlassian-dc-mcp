import { z } from 'zod';

export type WorklogChangeBean = {
    updatedTime?: number;
    worklogId?: number;
};

export const WorklogChangeBeanSchema = z.looseObject({
  updatedTime: z.number().optional(),
  worklogId: z.number().optional(),
}) as unknown as z.ZodType<WorklogChangeBean>;
