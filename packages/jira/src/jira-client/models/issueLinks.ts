/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IssueLinkTypeJsonBean } from './issueLinkTypeJsonBean.js';
import type { IssueRefJsonBean } from './issueRefJsonBean.js';
export type issueLinks = {
    id?: string;
    inwardIssue?: IssueRefJsonBean;
    outwardIssue?: IssueRefJsonBean;
    self?: string;
    type?: IssueLinkTypeJsonBean;
};

