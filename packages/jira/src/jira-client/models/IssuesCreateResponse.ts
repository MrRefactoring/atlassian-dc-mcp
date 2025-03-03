/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkOperationErrorResult } from './BulkOperationErrorResult.js';
import type { IssueCreateResponse } from './IssueCreateResponse.js';
export type IssuesCreateResponse = {
    errors?: Array<BulkOperationErrorResult>;
    issues?: Array<IssueCreateResponse>;
};

