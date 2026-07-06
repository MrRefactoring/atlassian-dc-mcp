import { z } from 'zod';

export type AddFieldBean = {
  fieldId?: string;
};

export const AddFieldBeanSchema = z.looseObject({
  fieldId: z.string().optional(),
}) as unknown as z.ZodType<AddFieldBean>;
