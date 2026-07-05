import { z } from 'zod';
import { IssueTypeJsonBeanSchema, type IssueTypeJsonBean } from './issueTypeJsonBean.js';

export type IssueTypeSchemeBean = {
    defaultIssueType?: IssueTypeJsonBean;
    description?: string;
    expand?: string;
    id?: string;
    issueTypes?: Array<IssueTypeJsonBean>;
    name?: string;
    self?: string;
};

export const IssueTypeSchemeBeanSchema = z.lazy(() => z.looseObject({
  defaultIssueType: IssueTypeJsonBeanSchema.optional(),
  description: z.string().optional(),
  expand: z.string().optional(),
  id: z.string().optional(),
  issueTypes: z.array(IssueTypeJsonBeanSchema).optional(),
  name: z.string().optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<IssueTypeSchemeBean>;
