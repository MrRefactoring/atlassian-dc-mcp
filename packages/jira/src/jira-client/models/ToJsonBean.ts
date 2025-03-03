/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupJsonBean } from './GroupJsonBean.js';
import type { UserJsonBean } from './UserJsonBean.js';
export type ToJsonBean = {
    assignee?: boolean;
    groups?: Array<GroupJsonBean>;
    reporter?: boolean;
    users?: Array<UserJsonBean>;
    voters?: boolean;
    watchers?: boolean;
};

