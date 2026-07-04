/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldBean } from './fieldBean.js';
import type { GroupJsonBean } from './groupJsonBean.js';
import type { ProjectRoleBean } from './projectRoleBean.js';
import type { UserJsonBean } from './userJsonBean.js';
export type PermissionHolderBean = {
    field?: FieldBean;
    group?: GroupJsonBean;
    parameter?: string;
    projectRole?: ProjectRoleBean;
    type?: string;
    user?: UserJsonBean;
};

