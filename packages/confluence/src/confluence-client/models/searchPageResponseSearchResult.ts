/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cursor } from './cursor.js';
import type { PageRequest } from './pageRequest.js';
import type { SearchResult } from './searchResult.js';
export type SearchPageResponseSearchResult = {
    results?: Array<SearchResult>;
    hasMore?: boolean;
    cqlQuery?: string;
    pageRequest?: PageRequest;
    totalSize?: number;
    searchDuration?: number;
    archivedResultCount?: number;
    nextCursor?: Cursor;
    prevCursor?: Cursor;
    totalCount?: number;
};


