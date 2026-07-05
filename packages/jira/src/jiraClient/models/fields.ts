import { z } from 'zod';
import { IssueTypeJsonBeanSchema, type IssueTypeJsonBean } from './issueTypeJsonBean.js';
import { PriorityJsonBeanSchema, type PriorityJsonBean } from './priorityJsonBean.js';
import { StatusJsonBeanSchema, type StatusJsonBean } from './statusJsonBean.js';

export type Fields = {
  issuetype?: IssueTypeJsonBean;
  priority?: PriorityJsonBean;
  status?: StatusJsonBean;
  summary?: string;
};

export const FieldsSchema = z.lazy(() => z.looseObject({
  issuetype: IssueTypeJsonBeanSchema.optional(),
  priority: PriorityJsonBeanSchema.optional(),
  status: StatusJsonBeanSchema.optional(),
  summary: z.string().optional(),
})) as unknown as z.ZodType<Fields>;
