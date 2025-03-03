/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProjectUpdateBean = {
    assigneeType?: ProjectUpdateBean.assigneeType;
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
};
export namespace ProjectUpdateBean {
    export enum assigneeType {
        PROJECT_LEAD = 'PROJECT_LEAD',
        UNASSIGNED = 'UNASSIGNED',
    }
}

