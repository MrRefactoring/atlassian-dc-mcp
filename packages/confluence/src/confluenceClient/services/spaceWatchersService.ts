/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/user.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SpaceWatchersService {
    /**
     * Fetch users watching space
     * Returns a paginated list of users watching the given Space identified by spaceKey. Only a Confluence Administrator or Space Administrator can perform this action.
     * @param spaceKey the key of the Space the User is attempting to view.
     * @param limit
     * @param start
     * @returns any returns a paginated list of users watching the given Space identified by spaceKey
     * @throws ApiError
     */
    public static index4(
        spaceKey: string,
        limit: number = 25,
        start?: number,
    ): CancelablePromise<{
        results?: Array<User>;
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
            url: '/rest/api/space/{spaceKey}/watchers',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                401: `The user is not authenticated or does not have the <b>LICENSED</b> permission.`,
                403: `The user is not a Confluence Administrator or Space Administrator.`,
                404: `The Space does not exist.`,
            },
        });
    }
}


