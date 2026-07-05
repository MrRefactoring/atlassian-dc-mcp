import { z } from 'zod';

export type IncludedFields = {
    included?: Array<string>;
};

export const IncludedFieldsSchema = z.looseObject({
  included: z.array(z.string()).optional(),
}) as unknown as z.ZodType<IncludedFields>;
