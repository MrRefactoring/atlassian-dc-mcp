import { z } from 'zod';

export type SecurityLevelJsonBean = {
  description?: string;
  id?: string;
  name?: string;
  self?: string;
};

export const SecurityLevelJsonBeanSchema = z.looseObject({
  description: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<SecurityLevelJsonBean>;
