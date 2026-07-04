/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProjectInputBean = {
    assigneeType?: ProjectInputBean.assigneeType;
    avatarId?: number;
    categoryId?: number;
    description?: string;
    issueSecurityScheme?: number;
    key?: string;
    lead?: string;
    name?: string;
    notificationScheme?: number;
    permissionScheme?: number;
    projectTemplateKey?: string;
    projectTypeKey?: string;
    url?: string;
    workflowSchemeId?: number;
};
export namespace ProjectInputBean {
    export enum assigneeType {
        PROJECT_LEAD = 'PROJECT_LEAD',
        UNASSIGNED = 'UNASSIGNED',
    }
}

