import { z } from 'zod';
import { ErrorCollectionSchema, type ErrorCollection } from './errorCollection.js';

export type BulkOperationErrorResult = {
    elementErrors?: ErrorCollection;
    failedElementNumber?: number;
    status?: number;
};

export const BulkOperationErrorResultSchema = z.lazy(() => z.looseObject({
  elementErrors: ErrorCollectionSchema.optional(),
  failedElementNumber: z.number().optional(),
  status: z.number().optional(),
})) as unknown as z.ZodType<BulkOperationErrorResult>;
