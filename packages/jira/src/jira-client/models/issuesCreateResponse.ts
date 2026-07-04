/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkOperationErrorResult } from './bulkOperationErrorResult.js';
import type { IssueCreateResponse } from './issueCreateResponse.js';
export type IssuesCreateResponse = {
    errors?: Array<BulkOperationErrorResult>;
    issues?: Array<IssueCreateResponse>;
};

