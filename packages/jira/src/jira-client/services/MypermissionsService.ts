/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionsJsonBean } from '../models/PermissionsJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class MypermissionsService {
    /**
     * Get permissions for the logged in user
     * Returns all permissions in the system and whether the currently logged in user has them. You can optionally provide a specific context to get permissions for (projectKey OR projectId OR issueKey OR issueId)
     * @param issueId id of the issue to scope returned permissions for.
     * @param projectKey key of project to scope returned permissions for.
     * @param issueKey key of the issue to scope returned permissions for.
     * @param projectId id of project to scope returned permissions for.
     * @returns PermissionsJsonBean Returns a list of all permissions in Jira and whether the user has them.
     * @throws ApiError
     */
    public static getPermissions(
        issueId?: string,
        projectKey?: string,
        issueKey?: string,
        projectId?: string,
    ): CancelablePromise<PermissionsJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/mypermissions',
            query: {
                'issueId': issueId,
                'projectKey': projectKey,
                'issueKey': issueKey,
                'projectId': projectId,
            },
            errors: {
                400: `Returned if the project or issue id is invalid.`,
                401: `Returned if request is on behalf of anonymous user.`,
                404: `Returned if the project or issue id or key is not found.`,
            },
        });
    }
}
