/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Person } from '../models/person.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class AdminUsersService {
    /**
     * Get active users
     * Gets a paginated collection of all active users (users which count into license usage).
     * This will exclude users that are:
     * - anonymous,
     * - deactivated,
     * - externally deleted,
     * - shadowed
     * - unlicensed
     *
     * This feature relies on search index and might not be accurate when site reindex is in progress.
     *
     * Example request URI(s):
     * `http://example.com/confluence/rest/api/admin/users/list/active`
     * `http://example.com/confluence/rest/api/admin/users/list/active?start=0`
     * `http://example.com/confluence/rest/api/admin/users/list/active?start=0&limit=100`
     * `http://example.com/confluence/rest/api/admin/users/list/active?start=0&limit=100&expand=status`
     *
     * @param expand properties to expand on the user.
     * @param limit the limit of the number of users to return, this may be restricted by fixed system limits.
     * @param start the start point of the collection to return. This must be non-negative. Default value is 0.
     * @returns any returns a paginated collection of users.
     * @throws ApiError
     */
    public static getActiveUsers(
        expand?: string,
        limit?: string,
        start?: string,
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
            url: '/rest/api/admin/users/list/active',
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `Returned if the calling user does not have permission to view users. This is possible for anonymous or un-licensed users.`,
            },
        });
    }
}


