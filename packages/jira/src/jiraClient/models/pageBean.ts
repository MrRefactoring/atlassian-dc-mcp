import { z } from 'zod';

export type PageBean = {
    isLast?: boolean;
    maxResults?: number;
    nextPage?: string;
    self?: string;
    startAt?: number;
    total?: number;
    values?: Array<Record<string, any>>;
};

export const PageBeanSchema = z.looseObject({
  isLast: z.boolean().optional(),
  maxResults: z.number().optional(),
  nextPage: z.string().optional(),
  self: z.string().optional(),
  startAt: z.number().optional(),
  total: z.number().optional(),
  values: z.array(z.record(z.string(), z.any())).optional(),
}) as unknown as z.ZodType<PageBean>;
