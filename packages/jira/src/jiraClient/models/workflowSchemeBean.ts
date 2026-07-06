import { z } from 'zod';
import { IssueTypeJsonBeanSchema, type IssueTypeJsonBean } from './issueTypeJsonBean.js';
import { UserBeanSchema, type UserBean } from './userBean.js';

export type WorkflowSchemeBean = {
  defaultWorkflow?: string;
  description?: string;
  draft?: boolean;
  id?: number;
  issueTypeMappings?: Record<string, string>;
  issueTypes?: Record<string, IssueTypeJsonBean>;
  lastModified?: string;
  lastModifiedUser?: UserBean;
  name?: string;
  originalDefaultWorkflow?: string;
  originalIssueTypeMappings?: Record<string, string>;
  self?: string;
  updateDraftIfNeeded?: boolean;
};

export const WorkflowSchemeBeanSchema = z.lazy(() => z.looseObject({
  defaultWorkflow: z.string().optional(),
  description: z.string().optional(),
  draft: z.boolean().optional(),
  id: z.number().optional(),
  issueTypeMappings: z.record(z.string(), z.string()).optional(),
  issueTypes: z.record(z.string(), IssueTypeJsonBeanSchema).optional(),
  lastModified: z.string().optional(),
  lastModifiedUser: UserBeanSchema.optional(),
  name: z.string().optional(),
  originalDefaultWorkflow: z.string().optional(),
  originalIssueTypeMappings: z.record(z.string(), z.string()).optional(),
  self: z.string().optional(),
  updateDraftIfNeeded: z.boolean().optional(),
})) as unknown as z.ZodType<WorkflowSchemeBean>;
