/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IssueBean } from './IssueBean.js';
import type { JsonTypeBean } from './JsonTypeBean.js';
export type SearchResultsBean = {
    expand?: string;
    issues?: Array<IssueBean>;
    maxResults?: number;
    names?: Record<string, string>;
    schema?: Record<string, JsonTypeBean>;
    startAt?: number;
    total?: number;
    warningMessages?: Array<string>;
};

