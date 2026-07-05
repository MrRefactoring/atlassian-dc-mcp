import { z } from 'zod';
import { IssueBeanSchema, type IssueBean } from './issueBean.js';
import { JsonTypeBeanSchema, type JsonTypeBean } from './jsonTypeBean.js';

export type SearchResultsBean = {
  expand?: string;
  issues?: Array<IssueBean>;
  maxResults?: number;
  names?: Record<string, string>;
  schema?: Record<string, JsonTypeBean>;
  startAt?: number;
  total?: number;
  warningMessages?: Array<string>;
};

export const SearchResultsBeanSchema = z.lazy(() => z.looseObject({
  expand: z.string().optional(),
  issues: z.array(IssueBeanSchema).optional(),
  maxResults: z.number().optional(),
  names: z.record(z.string(), z.string()).optional(),
  schema: z.record(z.string(), JsonTypeBeanSchema).optional(),
  startAt: z.number().optional(),
  total: z.number().optional(),
  warningMessages: z.array(z.string()).optional(),
})) as unknown as z.ZodType<SearchResultsBean>;
