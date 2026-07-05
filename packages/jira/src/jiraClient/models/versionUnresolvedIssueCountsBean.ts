import { z } from 'zod';

export type VersionUnresolvedIssueCountsBean = {
    issuesUnresolvedCount?: number;
    self?: string;
};

export const VersionUnresolvedIssueCountsBeanSchema = z.looseObject({
  issuesUnresolvedCount: z.number().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<VersionUnresolvedIssueCountsBean>;
