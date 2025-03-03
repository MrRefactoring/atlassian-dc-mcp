/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterPermissionBean } from './FilterPermissionBean.js';
import type { UserBean } from './UserBean.js';
import type { UserBeanListWrapper } from './UserBeanListWrapper.js';
export type FilterBean = {
    description?: string;
    editable?: boolean;
    favourite?: boolean;
    id?: string;
    jql?: string;
    name?: string;
    owner?: UserBean;
    searchUrl?: string;
    self?: string;
    sharePermissions?: Array<FilterPermissionBean>;
    sharedUsers?: UserBeanListWrapper;
    viewUrl?: string;
};

