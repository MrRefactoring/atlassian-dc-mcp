import { z } from 'zod';

export type WorklogIdsRequestBean = {
    /**
     * List of worklog ids
     */
    ids?: Array<number>;
};

export const WorklogIdsRequestBeanSchema = z.looseObject({
  ids: z.array(z.number()).optional(),
}) as unknown as z.ZodType<WorklogIdsRequestBean>;
