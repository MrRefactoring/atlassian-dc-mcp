/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './cursor.js';
import type { NodeStatus } from './nodeStatus.js';
import type { PageRequest } from './pageRequest.js';
export type PageResponseNodeStatus = {
    pageRequest?: PageRequest;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    results?: Array<NodeStatus>;
    totalCount?: number;
};


