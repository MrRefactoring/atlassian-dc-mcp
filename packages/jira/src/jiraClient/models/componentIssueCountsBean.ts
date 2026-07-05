import { z } from 'zod';

export type ComponentIssueCountsBean = {
    issueCount?: number;
    self?: string;
};

export const ComponentIssueCountsBeanSchema = z.looseObject({
  issueCount: z.number().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<ComponentIssueCountsBean>;
