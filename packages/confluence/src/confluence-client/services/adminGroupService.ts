/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Group } from '../models/group.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class AdminGroupService {
    /**
     * Create group
     * Creates the given group identified by name.
     * @param requestBody
     * @returns Group returns the new group if group is created successfully
     * @throws ApiError
     */
    public static create(
        requestBody?: Group,
    ): CancelablePromise<Group> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/admin/group',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `returned if request does not provide a name`,
                403: `returned if user does not have enough permission`,
                409: `returned if group with the same name already exists`,
            },
        });
    }
    /**
     * Delete group
     * Deletes the given group identified by name.
     * @param groupName the group name to be deleted
     * @returns void
     * @throws ApiError
     */
    public static delete(
        groupName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/admin/group/{groupName}',
            path: {
                'groupName': groupName,
            },
            errors: {
                400: `returned if user is attempting to delete the last admin group`,
                403: `returned if user does not have correct permission`,
                404: `returned if group cannot be found`,
            },
        });
    }
}


