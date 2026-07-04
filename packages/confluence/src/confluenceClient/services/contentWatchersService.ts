/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/user.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentWatchersService {
    /**
     * Fetch users watching a given content
     * Returns a paginated list of Users watching the given Content identified by contentId. Only a Confluence Administrator or Space Administrator can perform this action.
     * @param contentId the ID of the Content the User is attempting to view the watchers for.
     * @param limit The limit of the number of users to return, this may be restricted by fixed system limit.
     * @param start The start point of the collection to return.
     * @returns any The list of Users watching the Content.
     * @throws ApiError
     */
    public static index(
        contentId: string,
        limit?: string,
        start?: string,
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
            url: '/rest/api/content/{contentId}/watchers',
            path: {
                'contentId': contentId,
            },
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                400: `Returned if the requested Content is not of type BlogPost or Page.`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User is not a Confluence Administrator or Space Administrator.`,
                404: `Returned if the Content does not exist.`,
            },
        });
    }
}


