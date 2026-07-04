/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './cursor.js';
import type { Group } from './group.js';
import type { PageRequest } from './pageRequest.js';
export type PageResponseGroup = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<Group>;
    totalCount?: number;
};


