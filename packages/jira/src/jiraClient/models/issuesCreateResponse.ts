import { z } from 'zod';
import { BulkOperationErrorResultSchema, type BulkOperationErrorResult } from './bulkOperationErrorResult.js';
import { IssueCreateResponseSchema, type IssueCreateResponse } from './issueCreateResponse.js';

export type IssuesCreateResponse = {
  errors?: Array<BulkOperationErrorResult>;
  issues?: Array<IssueCreateResponse>;
};

export const IssuesCreateResponseSchema = z.lazy(() => z.looseObject({
  errors: z.array(BulkOperationErrorResultSchema).optional(),
  issues: z.array(IssueCreateResponseSchema).optional(),
})) as unknown as z.ZodType<IssuesCreateResponse>;
