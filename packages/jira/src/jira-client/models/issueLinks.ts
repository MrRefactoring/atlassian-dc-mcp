/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IssueLinkTypeJsonBean } from './IssueLinkTypeJsonBean.js';
import type { IssueRefJsonBean } from './IssueRefJsonBean.js';
export type issueLinks = {
    id?: string;
    inwardIssue?: IssueRefJsonBean;
    outwardIssue?: IssueRefJsonBean;
    self?: string;
    type?: IssueLinkTypeJsonBean;
};

