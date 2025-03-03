/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserBean } from './UserBean.js';
export type ComponentBean = {
    archived?: boolean;
    assigneeType?: ComponentBean.assigneeType;
    deleted?: boolean;
    description?: string;
    id?: string;
    lead?: UserBean;
    leadUserName?: string;
    name?: string;
    project?: string;
    self?: string;
};
export namespace ComponentBean {
    export enum assigneeType {
        PROJECT_DEFAULT = 'PROJECT_DEFAULT',
        COMPONENT_LEAD = 'COMPONENT_LEAD',
        PROJECT_LEAD = 'PROJECT_LEAD',
        UNASSIGNED = 'UNASSIGNED',
    }
}

