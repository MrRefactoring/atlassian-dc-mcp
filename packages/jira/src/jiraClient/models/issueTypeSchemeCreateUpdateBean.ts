import { z } from 'zod';

export type IssueTypeSchemeCreateUpdateBean = {
  defaultIssueTypeId?: string;
  description?: string;
  issueTypeIDs?: Array<string>;
  issueTypeIds?: Array<string>;
  name?: string;
};

export const IssueTypeSchemeCreateUpdateBeanSchema = z.looseObject({
  defaultIssueTypeId: z.string().optional(),
  description: z.string().optional(),
  issueTypeIDs: z.array(z.string()).optional(),
  issueTypeIds: z.array(z.string()).optional(),
  name: z.string().optional(),
}) as unknown as z.ZodType<IssueTypeSchemeCreateUpdateBean>;
