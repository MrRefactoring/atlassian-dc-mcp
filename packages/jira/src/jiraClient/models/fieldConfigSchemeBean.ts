/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldBean } from './fieldBean.js';
import type { IssueTypeJsonBean } from './issueTypeJsonBean.js';
import type { ProjectBean } from './projectBean.js';
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

