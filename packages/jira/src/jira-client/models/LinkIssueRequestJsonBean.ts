/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentJsonBean } from './CommentJsonBean.js';
import type { IssueLinkTypeJsonBean } from './IssueLinkTypeJsonBean.js';
import type { IssueRefJsonBean } from './IssueRefJsonBean.js';
export type LinkIssueRequestJsonBean = {
    comment?: CommentJsonBean;
    inwardIssue?: IssueRefJsonBean;
    outwardIssue?: IssueRefJsonBean;
    type?: IssueLinkTypeJsonBean;
};

