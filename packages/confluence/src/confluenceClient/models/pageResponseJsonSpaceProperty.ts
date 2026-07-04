/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './cursor.js';
import type { JsonSpaceProperty } from './jsonSpaceProperty.js';
import type { PageRequest } from './pageRequest.js';
export type PageResponseJsonSpaceProperty = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<JsonSpaceProperty>;
    totalCount?: number;
};


