import { z } from 'zod';

export type VersionUsageInCustomFields = {
  customFieldId?: number;
  fieldName?: string;
  issueCountWithVersionInCustomField?: number;
};

export const VersionUsageInCustomFieldsSchema = z.looseObject({
  customFieldId: z.number().optional(),
  fieldName: z.string().optional(),
  issueCountWithVersionInCustomField: z.number().optional(),
}) as unknown as z.ZodType<VersionUsageInCustomFields>;
