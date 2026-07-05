import { z } from 'zod';
import { VersionUsageInCustomFieldsSchema, type VersionUsageInCustomFields } from './versionUsageInCustomFields.js';

export type VersionIssueCountsBean = {
  customFieldNames?: Array<VersionUsageInCustomFields>;
  issueCountWithCustomFieldsShowingVersion?: number;
  issuesAffectedCount?: number;
  issuesFixedCount?: number;
  self?: string;
};

export const VersionIssueCountsBeanSchema = z.lazy(() => z.looseObject({
  customFieldNames: z.array(VersionUsageInCustomFieldsSchema).optional(),
  issueCountWithCustomFieldsShowingVersion: z.number().optional(),
  issuesAffectedCount: z.number().optional(),
  issuesFixedCount: z.number().optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<VersionIssueCountsBean>;
