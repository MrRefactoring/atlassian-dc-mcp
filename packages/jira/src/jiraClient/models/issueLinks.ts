import { z } from 'zod';
import { IssueLinkTypeJsonBeanSchema, type IssueLinkTypeJsonBean } from './issueLinkTypeJsonBean.js';
import { IssueRefJsonBeanSchema, type IssueRefJsonBean } from './issueRefJsonBean.js';

export type issueLinks = {
    id?: string;
    inwardIssue?: IssueRefJsonBean;
    outwardIssue?: IssueRefJsonBean;
    self?: string;
    type?: IssueLinkTypeJsonBean;
};

export const issueLinksSchema = z.lazy(() => z.looseObject({
  id: z.string().optional(),
  inwardIssue: IssueRefJsonBeanSchema.optional(),
  outwardIssue: IssueRefJsonBeanSchema.optional(),
  self: z.string().optional(),
  type: IssueLinkTypeJsonBeanSchema.optional(),
})) as unknown as z.ZodType<issueLinks>;
