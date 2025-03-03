/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IssueTypeJsonBean } from './IssueTypeJsonBean.js';
import type { UserBean } from './UserBean.js';
export type WorkflowSchemeBean = {
    defaultWorkflow?: string;
    description?: string;
    draft?: boolean;
    id?: number;
    issueTypeMappings?: Record<string, string>;
    issueTypes?: Record<string, IssueTypeJsonBean>;
    lastModified?: string;
    lastModifiedUser?: UserBean;
    name?: string;
    originalDefaultWorkflow?: string;
    originalIssueTypeMappings?: Record<string, string>;
    self?: string;
    updateDraftIfNeeded?: boolean;
};

