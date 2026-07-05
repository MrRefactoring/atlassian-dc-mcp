import { z } from 'zod';

export type IssueTypeMappingBean = {
    issueType?: string;
    updateDraftIfNeeded?: boolean;
    workflow?: string;
};

export const IssueTypeMappingBeanSchema = z.looseObject({
  issueType: z.string().optional(),
  updateDraftIfNeeded: z.boolean().optional(),
  workflow: z.string().optional(),
}) as unknown as z.ZodType<IssueTypeMappingBean>;
