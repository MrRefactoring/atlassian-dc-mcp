/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A map of permission keys to permission objects.
 */
export type PermissionJsonBean = {
    description?: string;
    id?: string;
    key?: string;
    name?: string;
    type?: PermissionJsonBean.type;
};
export namespace PermissionJsonBean {
    export enum type {
        GLOBAL = 'GLOBAL',
        PROJECT = 'PROJECT',
    }
}

