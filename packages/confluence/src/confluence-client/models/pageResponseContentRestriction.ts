/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentRestriction } from './contentRestriction.js';
import type { Cursor } from './cursor.js';
import type { PageRequest } from './pageRequest.js';
export type PageResponseContentRestriction = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<ContentRestriction>;
    totalCount?: number;
};


