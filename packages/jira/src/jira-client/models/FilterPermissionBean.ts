/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupJsonBean } from './GroupJsonBean.js';
import type { ProjectBean } from './ProjectBean.js';
import type { ProjectRoleBean } from './ProjectRoleBean.js';
import type { UserBean } from './UserBean.js';
export type FilterPermissionBean = {
    edit?: boolean;
    group?: GroupJsonBean;
    id?: number;
    project?: ProjectBean;
    role?: ProjectRoleBean;
    type?: string;
    user?: UserBean;
    view?: boolean;
};

