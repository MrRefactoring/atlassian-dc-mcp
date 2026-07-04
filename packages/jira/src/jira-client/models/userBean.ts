/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SimpleListWrapperApplicationRoleBean } from './simpleListWrapperApplicationRoleBean.js';
import type { SimpleListWrapperGroupJsonBean } from './simpleListWrapperGroupJsonBean.js';
export type UserBean = {
    active?: boolean;
    applicationRoles?: SimpleListWrapperApplicationRoleBean;
    avatarUrls?: Record<string, string>;
    deleted?: boolean;
    displayName?: string;
    emailAddress?: string;
    expand?: string;
    groups?: SimpleListWrapperGroupJsonBean;
    key?: string;
    lastLoginTime?: string;
    locale?: string;
    name?: string;
    self?: string;
    timeZone?: string;
};

