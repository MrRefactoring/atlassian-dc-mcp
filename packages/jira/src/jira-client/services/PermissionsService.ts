/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionsJsonBean } from '../models/PermissionsJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class PermissionsService {
    /**
     * Get all permissions present in Jira instance
     * Returns all permissions that are present in the Jira instance - Global, Project and the global ones added by plugins
     * @returns PermissionsJsonBean Returns a list of all permissions in Jira.
     * @throws ApiError
     */
    public static getAllPermissions(): CancelablePromise<PermissionsJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/permissions',
            errors: {
                401: `Returned for unauthenticated requests`,
                403: `Returned for users without administer permissions`,
            },
        });
    }
}
