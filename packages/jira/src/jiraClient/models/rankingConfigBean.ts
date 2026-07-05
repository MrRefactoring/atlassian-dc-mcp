import { z } from 'zod';

export type RankingConfigBean = {
  rankCustomFieldId?: number;
};

export const RankingConfigBeanSchema = z.looseObject({
  rankCustomFieldId: z.number().optional(),
}) as unknown as z.ZodType<RankingConfigBean>;
