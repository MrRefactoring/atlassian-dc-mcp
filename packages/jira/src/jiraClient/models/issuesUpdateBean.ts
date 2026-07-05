import { z } from 'zod';
import { IssueUpdateBeanSchema, type IssueUpdateBean } from './issueUpdateBean.js';

export type IssuesUpdateBean = {
    issueUpdates?: Array<IssueUpdateBean>;
};

export const IssuesUpdateBeanSchema = z.lazy(() => z.looseObject({
  issueUpdates: z.array(IssueUpdateBeanSchema).optional(),
})) as unknown as z.ZodType<IssuesUpdateBean>;
