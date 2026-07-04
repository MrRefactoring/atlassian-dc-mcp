/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './cursor.js';
import type { LongTaskStatus } from './longTaskStatus.js';
import type { PageRequest } from './pageRequest.js';
export type PageResponseLongTaskStatus = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<LongTaskStatus>;
    totalCount?: number;
};


