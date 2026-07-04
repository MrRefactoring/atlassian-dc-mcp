/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Group } from '../models/group.js';
import type { Person } from '../models/person.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class GroupService {
    /**
     * Get group by name
     * Get the user group with the group name
     * @param groupName
     * @param expand
     * @returns Group The user group with the group name
     * @throws ApiError
     */
    public static getGroup(
        groupName: string,
        expand?: string,
    ): CancelablePromise<Group> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/group/{groupName}',
            path: {
                'groupName': groupName,
            },
            query: {
                'expand': expand,
            },
            errors: {
                403: `The calling user does not have permission to view groups`,
            },
        });
    }
    /**
     * Get groups
     * Get a paginated collection of user groups
     * @param expand
     * @param limit
     * @param start
     * @returns any The number of user groups in the system
     * @throws ApiError
     */
    public static getGroups(
        expand: string = '',
        limit: number = 200,
        start?: number,
    ): CancelablePromise<{
        results?: Array<Group>;
        totalCount?: number;
        start?: number;
        limit?: number;
        size?: number;
        _links?: {
            base?: string;
            context?: string;
            self?: string;
            next?: string;
            prev?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/group',
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `The calling user does not have permission to view groups`,
            },
        });
    }
    /**
     * Get members of group
     * Get a paginated collection of users in the given group
     * @param groupName
     * @param expand
     * @param limit
     * @param start
     * @returns any a collection of users in the given group
     * @throws ApiError
     */
    public static getMembers(
        groupName: Group,
        expand?: string,
        limit: number = 200,
        start?: number,
    ): CancelablePromise<{
        results?: Array<Person>;
        totalCount?: number;
        start?: number;
        limit?: number;
        size?: number;
        _links?: {
            base?: string;
            context?: string;
            self?: string;
            next?: string;
            prev?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/group/{groupName}/member',
            path: {
                'groupName': groupName,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `The calling user does not have permission to view groups`,
            },
        });
    }
    /**
     * Get group members of group
     * Get a paginated collection of groups in the given group
     * @param groupName
     * @param expand
     * @param limit
     * @param start
     * @returns any a collection of groups in the given group
     * @throws ApiError
     */
    public static getNestedGroupMembers(
        groupName: Group,
        expand?: string,
        limit: number = 200,
        start?: number,
    ): CancelablePromise<{
        results?: Array<Group>;
        totalCount?: number;
        start?: number;
        limit?: number;
        size?: number;
        _links?: {
            base?: string;
            context?: string;
            self?: string;
            next?: string;
            prev?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/group/{groupName}/groupmember',
            path: {
                'groupName': groupName,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `The calling user does not have permission to view groups`,
            },
        });
    }
}


