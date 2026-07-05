import { z } from 'zod';

export type FieldOperation = {
  operation?: string;
  value?: Record<string, any>;
};

export const FieldOperationSchema = z.looseObject({
  operation: z.string().optional(),
  value: z.record(z.string(), z.any()).optional(),
}) as unknown as z.ZodType<FieldOperation>;
