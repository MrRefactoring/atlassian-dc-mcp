/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserJsonBean } from './UserJsonBean.js';
import type { VisibilityJsonBean } from './VisibilityJsonBean.js';
export type worklog = {
    author?: UserJsonBean;
    comment?: string;
    created?: string;
    id?: string;
    issueId?: string;
    self?: string;
    started?: string;
    timeSpent?: string;
    timeSpentSeconds?: number;
    updateAuthor?: UserJsonBean;
    updated?: string;
    visibility?: VisibilityJsonBean;
};

