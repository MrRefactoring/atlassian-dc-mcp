import { z } from 'zod';

export type IssueRankRequestBean = {
    issues?: Array<string>;
    rankAfterIssue?: string;
    rankBeforeIssue?: string;
    rankCustomFieldId?: number;
};

export const IssueRankRequestBeanSchema = z.looseObject({
  issues: z.array(z.string()).optional(),
  rankAfterIssue: z.string().optional(),
  rankBeforeIssue: z.string().optional(),
  rankCustomFieldId: z.number().optional(),
}) as unknown as z.ZodType<IssueRankRequestBean>;
