/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './cursor.js';
import type { JsonContentProperty } from './jsonContentProperty.js';
import type { PageRequest } from './pageRequest.js';
export type PageResponseJsonContentProperty = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<JsonContentProperty>;
    totalCount?: number;
};


