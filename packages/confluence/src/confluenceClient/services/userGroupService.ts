/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class UserGroupService {
    /**
     * Update user group
     * Add the given User identified by username to the given Group identified by groupName.
     *
     * This method is idempotent i.e., if the membership already exists then no action will be taken.
     * @param groupName The group name identifying the given group.
     * @param username The username identifying the given user.
     * @returns void
     * @throws ApiError
     */
    public static update5(
        groupName: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/user/{username}/group/{groupName}',
            path: {
                'groupName': groupName,
                'username': username,
            },
        });
    }
    /**
     * Delete user group
     * Removes the given User identified by username from the given Group identified by groupName.
     *
     * This method is idempotent i.e., if the membership already exists then no action will be taken.
     * @param groupName The group name identifying the given group.
     * @param username The username identifying the given user.
     * @returns void
     * @throws ApiError
     */
    public static delete6(
        groupName: string,
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/user/{username}/group/{groupName}',
            path: {
                'groupName': groupName,
                'username': username,
            },
        });
    }
}


