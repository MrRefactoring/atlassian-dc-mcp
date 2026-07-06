import { z } from 'zod';
import { IssueTypeSchemeBeanSchema, type IssueTypeSchemeBean } from './issueTypeSchemeBean.js';

export type IssueTypeSchemeListBean = {
  schemes?: Array<IssueTypeSchemeBean>;
};

export const IssueTypeSchemeListBeanSchema = z.lazy(() => z.looseObject({
  schemes: z.array(IssueTypeSchemeBeanSchema).optional(),
})) as unknown as z.ZodType<IssueTypeSchemeListBean>;
