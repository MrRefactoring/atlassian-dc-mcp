import { z } from 'zod';

export type PrioritySchemeBean = {
  defaultOptionId?: string;
  defaultScheme?: boolean;
  description?: string;
  id?: number;
  name?: string;
  optionIds?: Array<string>;
  projectKeys?: Array<string>;
  self?: string;
};

export const PrioritySchemeBeanSchema = z.looseObject({
  defaultOptionId: z.string().optional(),
  defaultScheme: z.boolean().optional(),
  description: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  optionIds: z.array(z.string()).optional(),
  projectKeys: z.array(z.string()).optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<PrioritySchemeBean>;
