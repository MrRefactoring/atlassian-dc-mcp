import { z } from 'zod';
import { IssueBeanSchema, type IssueBean } from './issueBean.js';
import { JsonTypeBeanSchema, type JsonTypeBean } from './jsonTypeBean.js';

export type SearchResultsBean = {
  expand?: string | null;
  issues?: Array<IssueBean>;
  maxResults?: number;
  names?: Record<string, string>;
  schema?: Record<string, JsonTypeBean>;
  startAt?: number;
  total?: number;
  warningMessages?: Array<string>;
};

export const SearchResultsBeanSchema = z.lazy(() => z.looseObject({
  expand: z.string().nullish(),
  issues: z.array(IssueBeanSchema).optional(),
  maxResults: z.number().optional(),
  names: z.record(z.string(), z.string()).nullish(),
  schema: z.record(z.string(), JsonTypeBeanSchema).nullish(),
  startAt: z.number().optional(),
  total: z.number().optional(),
  warningMessages: z.array(z.string()).nullish(),
})) as unknown as z.ZodType<SearchResultsBean>;
