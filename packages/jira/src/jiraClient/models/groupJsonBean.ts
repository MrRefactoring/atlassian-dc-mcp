import { z } from 'zod';

export type GroupJsonBean = {
    name?: string;
    self?: string;
};

export const GroupJsonBeanSchema = z.looseObject({
  name: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<GroupJsonBean>;
