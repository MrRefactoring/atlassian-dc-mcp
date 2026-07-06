import { z } from 'zod';

export type WorkflowMappingBean = {
  defaultMapping?: boolean;
  issueTypes?: Array<string>;
  updateDraftIfNeeded?: boolean;
  workflow?: string;
};

export const WorkflowMappingBeanSchema = z.looseObject({
  defaultMapping: z.boolean().optional(),
  issueTypes: z.array(z.string()).optional(),
  updateDraftIfNeeded: z.boolean().optional(),
  workflow: z.string().optional(),
}) as unknown as z.ZodType<WorkflowMappingBean>;
