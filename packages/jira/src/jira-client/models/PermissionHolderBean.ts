/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldBean } from './FieldBean.js';
import type { GroupJsonBean } from './GroupJsonBean.js';
import type { ProjectRoleBean } from './ProjectRoleBean.js';
import type { UserJsonBean } from './UserJsonBean.js';
export type PermissionHolderBean = {
    field?: FieldBean;
    group?: GroupJsonBean;
    parameter?: string;
    projectRole?: ProjectRoleBean;
    type?: string;
    user?: UserJsonBean;
};

