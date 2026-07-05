import { z } from 'zod';

export type SubqueryBean = {
    query?: string;
};

export const SubqueryBeanSchema = z.looseObject({
  query: z.string().optional(),
}) as unknown as z.ZodType<SubqueryBean>;
