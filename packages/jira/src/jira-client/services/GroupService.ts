/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddGroupBean } from '../models/AddGroupBean.js';
import type { GroupBean } from '../models/GroupBean.js';
import type { UpdateUserToGroupBean } from '../models/UpdateUserToGroupBean.js';
import type { UserJsonBean } from '../models/UserJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class GroupService {
    /**
     * Create a group with given parameters
     * Creates a group by given group parameter
     * @param requestBody
     * @returns GroupBean Returns full representation of a Jira group in JSON format.
     * @throws ApiError
     */
    public static createGroup(
        requestBody?: AddGroupBean,
    ): CancelablePromise<GroupBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/group',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if user requested an empty group name or group already exists`,
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user does not have administrator permissions.`,
            },
        });
    }
    /**
     * Delete a specified group
     * Deletes a group by given group parameter
     * @param groupname The name of the group to delete.
     * @param swapGroup A different group to transfer the restrictions to.
     * @returns any Returned if the group was deleted.
     * @throws ApiError
     */
    public static removeGroup(
        groupname: string,
        swapGroup?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/group',
            query: {
                'groupname': groupname,
                'swapGroup': swapGroup,
            },
            errors: {
                400: `Returned if user requested a group that does not exist`,
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user does not have administrator permissions.`,
                404: `Returned if the requested group was not found.`,
            },
        });
    }
    /**
     * Get users from a specified group
     * Returns a paginated list of users who are members of the specified group and its subgroups
     * @param groupname The group name.
     * @param includeInactiveUsers Include inactive users.
     * @param maxResults The maximum number of users to return.
     * @param startAt The index of the first user in group to return.
     * @returns UserJsonBean Returns a paginated list of users in the group
     * @throws ApiError
     */
    public static getUsersFromGroup(
        groupname: string,
        includeInactiveUsers?: string,
        maxResults?: string,
        startAt?: string,
    ): CancelablePromise<UserJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/group/member',
            query: {
                'includeInactiveUsers': includeInactiveUsers,
                'maxResults': maxResults,
                'groupname': groupname,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the name of the provided group is empty`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the calling user is not admin or sysadmin`,
                404: `Returned if the specified group does not exist`,
            },
        });
    }
    /**
     * Add a user to a specified group
     * Adds given user to a group
     * @param groupname A name of requested group.
     * @param requestBody
     * @returns GroupBean Returns full representation of a Jira group in JSON format.
     * @throws ApiError
     */
    public static addUserToGroup(
        groupname: string,
        requestBody?: UpdateUserToGroupBean,
    ): CancelablePromise<GroupBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/group/user',
            query: {
                'groupname': groupname,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if user requested an empty group name or the user already belongs to the group.`,
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user does not have administrator permissions.`,
                404: `Returned if the requested group was not found or requested user was not found.`,
            },
        });
    }
    /**
     * Remove a user from a specified group
     * Removes given user from a group
     * @param groupname A name of requested group.
     * @param username User to remove from a group
     * @returns any If the user was removed from the group.
     * @throws ApiError
     */
    public static removeUserFromGroup(
        groupname: string,
        username: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/group/user',
            query: {
                'groupname': groupname,
                'username': username,
            },
            errors: {
                400: `Returned if user requested an empty group name`,
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user does not have administrator permissions.`,
                404: `Returned if the requested group was not found or the requested user wan not found`,
            },
        });
    }
}
