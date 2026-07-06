import { z } from 'zod';

export type IssueAssignRequestBean = {
  issues?: Array<string>;
};

export const IssueAssignRequestBeanSchema = z.looseObject({
  issues: z.array(z.string()).optional(),
}) as unknown as z.ZodType<IssueAssignRequestBean>;
