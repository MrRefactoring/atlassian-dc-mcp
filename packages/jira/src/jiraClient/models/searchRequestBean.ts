import { z } from 'zod';

export type SearchRequestBean = {
    expand?: Array<string>;
    fields?: Array<string>;
    jql?: string;
    maxResults?: number;
    startAt?: number;
    validateQuery?: boolean;
};

export const SearchRequestBeanSchema = z.looseObject({
  expand: z.array(z.string()).optional(),
  fields: z.array(z.string()).optional(),
  jql: z.string().optional(),
  maxResults: z.number().optional(),
  startAt: z.number().optional(),
  validateQuery: z.boolean().optional(),
}) as unknown as z.ZodType<SearchRequestBean>;
