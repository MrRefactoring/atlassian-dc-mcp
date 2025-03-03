/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationRoleBean } from '../models/ApplicationRoleBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ApplicationroleService {
    /**
     * Get all application roles in the system
     * Returns all application roles in the system.
     * @returns ApplicationRoleBean Returns all ApplicationRoles in the system
     * @throws ApiError
     */
    public static getAll(): CancelablePromise<ApplicationRoleBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/applicationrole',
            errors: {
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user is not an administrator.`,
            },
        });
    }
    /**
     * Update application roles
     * Updates the ApplicationRoles with the passed data if the version hash is the same as the server. Only the groups and default groups setting of the role may be updated. Requests to change the key or the name of the role will be silently ignored. It is acceptable to pass only the roles that are updated as roles that are present in the server but not in data to update with, will not be deleted.
     * @param ifMatch
     * @param requestBody the data to update the roles with.
     * @returns ApplicationRoleBean Returns the updated ApplicationRoles if the update was successful.
     * @throws ApiError
     */
    public static putBulk(
        ifMatch?: string,
        requestBody?: ApplicationRoleBean,
    ): CancelablePromise<ApplicationRoleBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/applicationrole',
            headers: {
                'If-Match': ifMatch,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the current user does not have permission to edit roles.`,
                403: `Returned if the current user is not an administrator.`,
                404: `Returned if the role does not exist.`,
                412: `Returned if the versionHash is not null and contains a different version to the server.`,
            },
        });
    }
    /**
     * Get application role by key
     * Returns the ApplicationRole with passed key if it exists.
     * @param key the key of the role to use.
     * @returns ApplicationRoleBean Returns the ApplicationRole if it exists.
     * @throws ApiError
     */
    public static get4(
        key: string,
    ): CancelablePromise<ApplicationRoleBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/applicationrole/{key}',
            path: {
                'key': key,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user is not an administrator.`,
                404: `Returned if the role does not exist.`,
            },
        });
    }
    /**
     * Update application role
     * Updates the ApplicationRole with the passed data. Only the groups and default groups setting of the role may be updated. Requests to change the key or the name of the role will be silently ignored.
     * @param key the key of the role to update.
     * @param ifMatch
     * @param versionHash the hash of the version to update. Optional Param
     * @param requestBody the data to update the role with.
     * @returns ApplicationRoleBean Returns the updated ApplicationRole if the update was successful.
     * @throws ApiError
     */
    public static put2(
        key: string,
        ifMatch?: string,
        versionHash?: string,
        requestBody?: ApplicationRoleBean,
    ): CancelablePromise<ApplicationRoleBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/applicationrole/{key}',
            path: {
                'key': key,
            },
            headers: {
                'If-Match': ifMatch,
                'versionHash': versionHash,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the current user does not have permission to edit roles.`,
                403: `Returned if the current user is not an administrator.`,
                404: `Returned if the role does not exist.`,
                412: `Returned if the versionHash is not null and contains a different version to the server.`,
            },
        });
    }
}
