/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentJsonBean } from './commentJsonBean.js';
import type { IssueLinkTypeJsonBean } from './issueLinkTypeJsonBean.js';
import type { IssueRefJsonBean } from './issueRefJsonBean.js';
export type LinkIssueRequestJsonBean = {
    comment?: CommentJsonBean;
    inwardIssue?: IssueRefJsonBean;
    outwardIssue?: IssueRefJsonBean;
    type?: IssueLinkTypeJsonBean;
};

