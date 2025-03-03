/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorklogChangeBean } from './WorklogChangeBean.js';
export type WorklogChangedSinceBean = {
    isLastPage?: boolean;
    lastPage?: boolean;
    nextPage?: string;
    self?: string;
    since?: number;
    until?: number;
    values?: Array<WorklogChangeBean>;
};

