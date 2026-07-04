/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class DefaultService {
    /**
     * Get pull requests in inbox
     * Returns a page of pull requests in the user's inbox.
     * @param role
     * @param limit
     * @param start
     * @returns any default response
     * @throws ApiError
     */
    public static getPullRequests2(
        role: string = 'reviewer',
        limit: number = 25,
        start?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/inbox/pull-requests',
            query: {
                'role': role,
                'limit': limit,
                'start': start,
            },
        });
    }
    /**
     * Get total number of pull requests in inbox
     * Returns the total number of pull requests in the user's inbox
     * @returns any default response
     * @throws ApiError
     */
    public static getPullRequestCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/inbox/pull-requests/count',
        });
    }
}

