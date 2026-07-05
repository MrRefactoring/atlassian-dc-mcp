import { z } from 'zod';

export type BulkDeleteResponseBean = {
  deletedCustomFields?: Array<string>;
  message?: string;
  notDeletedCustomFields?: Record<string, string>;
};

export const BulkDeleteResponseBeanSchema = z.looseObject({
  deletedCustomFields: z.array(z.string()).optional(),
  message: z.string().optional(),
  notDeletedCustomFields: z.record(z.string(), z.string()).optional(),
}) as unknown as z.ZodType<BulkDeleteResponseBean>;
