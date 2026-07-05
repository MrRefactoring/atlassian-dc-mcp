import { z } from 'zod';
import { CustomFieldReplacementSchema, type CustomFieldReplacement } from './customFieldReplacement.js';

export type DeleteAndReplaceVersionBean = {
  customFieldReplacementList?: Array<CustomFieldReplacement>;
  moveAffectedIssuesTo?: number;
  moveFixIssuesTo?: number;
};

export const DeleteAndReplaceVersionBeanSchema = z.lazy(() => z.looseObject({
  customFieldReplacementList: z.array(CustomFieldReplacementSchema).optional(),
  moveAffectedIssuesTo: z.number().optional(),
  moveFixIssuesTo: z.number().optional(),
})) as unknown as z.ZodType<DeleteAndReplaceVersionBean>;
