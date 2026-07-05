import { z } from 'zod';

export type PrioritySchemeUpdateBean = {
  defaultOptionId?: string;
  description?: string;
  id?: number;
  name?: string;
  optionIds?: Array<string>;
};

export const PrioritySchemeUpdateBeanSchema = z.looseObject({
  defaultOptionId: z.string().optional(),
  description: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  optionIds: z.array(z.string()).optional(),
}) as unknown as z.ZodType<PrioritySchemeUpdateBean>;
