/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './cursor.js';
import type { PageRequest } from './pageRequest.js';
import type { Space } from './space.js';
export type PageResponseSpace = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<Space>;
    totalCount?: number;
};


