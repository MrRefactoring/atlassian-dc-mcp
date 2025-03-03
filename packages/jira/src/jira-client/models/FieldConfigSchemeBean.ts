/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldBean } from './FieldBean.js';
import type { IssueTypeJsonBean } from './IssueTypeJsonBean.js';
import type { ProjectBean } from './ProjectBean.js';
export type FieldConfigSchemeBean = {
    allIssueTypes?: boolean;
    allProjects?: boolean;
    defaultValue?: Record<string, any>;
    description?: string;
    field?: FieldBean;
    fieldConfigIds?: Array<number>;
    id?: number;
    issueTypes?: Array<IssueTypeJsonBean>;
    name?: string;
    projects?: Array<ProjectBean>;
    self?: string;
};

