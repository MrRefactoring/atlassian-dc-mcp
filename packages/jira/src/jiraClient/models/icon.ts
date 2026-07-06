import { z } from 'zod';

export type Icon = {
  link?: string;
  title?: string;
  url16x16?: string;
};

export const IconSchema = z.looseObject({
  link: z.string().optional(),
  title: z.string().optional(),
  url16x16: z.string().optional(),
}) as unknown as z.ZodType<Icon>;
