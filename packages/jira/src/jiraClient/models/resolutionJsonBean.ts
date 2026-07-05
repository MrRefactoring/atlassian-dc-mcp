import { z } from 'zod';

export type ResolutionJsonBean = {
  description?: string;
  iconUrl?: string;
  id?: string;
  name?: string;
  self?: string;
};

export const ResolutionJsonBeanSchema = z.looseObject({
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<ResolutionJsonBean>;
