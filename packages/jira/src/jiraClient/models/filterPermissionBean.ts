/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupJsonBean } from './groupJsonBean.js';
import type { ProjectBean } from './projectBean.js';
import type { ProjectRoleBean } from './projectRoleBean.js';
import type { UserBean } from './userBean.js';
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

