import { z } from 'zod';

export type EstimationFieldBean = {
  displayName?: string;
  fieldId?: string;
};

export const EstimationFieldBeanSchema = z.looseObject({
  displayName: z.string().optional(),
  fieldId: z.string().optional(),
}) as unknown as z.ZodType<EstimationFieldBean>;
