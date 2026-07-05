import { z } from 'zod';

export type CustomFieldReplacement = {
    customFieldId?: number;
    moveTo?: number;
};

export const CustomFieldReplacementSchema = z.looseObject({
  customFieldId: z.number().optional(),
  moveTo: z.number().optional(),
}) as unknown as z.ZodType<CustomFieldReplacement>;
