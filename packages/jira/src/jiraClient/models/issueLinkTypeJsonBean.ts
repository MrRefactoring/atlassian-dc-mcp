import { z } from 'zod';

export type IssueLinkTypeJsonBean = {
  id?: string;
  inward?: string;
  name?: string;
  outward?: string;
  self?: string;
};

export const IssueLinkTypeJsonBeanSchema = z.looseObject({
  id: z.string().optional(),
  inward: z.string().optional(),
  name: z.string().optional(),
  outward: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<IssueLinkTypeJsonBean>;
