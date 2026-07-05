import { z } from 'zod';

export type EpicRankRequestBean = {
    rankAfterEpic?: string;
    rankBeforeEpic?: string;
    rankCustomFieldId?: number;
};

export const EpicRankRequestBeanSchema = z.looseObject({
  rankAfterEpic: z.string().optional(),
  rankBeforeEpic: z.string().optional(),
  rankCustomFieldId: z.number().optional(),
}) as unknown as z.ZodType<EpicRankRequestBean>;
