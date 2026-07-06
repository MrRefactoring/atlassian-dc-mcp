import { z } from 'zod';
import { CommentJsonBeanSchema, type CommentJsonBean } from './commentJsonBean.js';
import { IssueLinkTypeJsonBeanSchema, type IssueLinkTypeJsonBean } from './issueLinkTypeJsonBean.js';
import { IssueRefJsonBeanSchema, type IssueRefJsonBean } from './issueRefJsonBean.js';

export type LinkIssueRequestJsonBean = {
  comment?: CommentJsonBean;
  inwardIssue?: IssueRefJsonBean;
  outwardIssue?: IssueRefJsonBean;
  type?: IssueLinkTypeJsonBean;
};

export const LinkIssueRequestJsonBeanSchema = z.lazy(() => z.looseObject({
  comment: CommentJsonBeanSchema.optional(),
  inwardIssue: IssueRefJsonBeanSchema.optional(),
  outwardIssue: IssueRefJsonBeanSchema.optional(),
  type: IssueLinkTypeJsonBeanSchema.optional(),
})) as unknown as z.ZodType<LinkIssueRequestJsonBean>;
