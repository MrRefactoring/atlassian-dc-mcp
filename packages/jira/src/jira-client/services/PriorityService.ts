/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PriorityJsonBean } from '../models/PriorityJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class PriorityService {
    /**
     * Get all issue priorities
     * Returns a list of all issue priorities
     * @returns PriorityJsonBean List of priorities
     * @throws ApiError
     */
    public static getPriorities(): CancelablePromise<PriorityJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/priority',
            errors: {
                401: `Returned if the user is not authenticated`,
            },
        });
    }
    /**
     * Get paginated issue priorities
     * Returns a page with list of issue priorities whose names (or their translations) match query
     * @param maxResults
     * @param query
     * @param projectIds
     * @param startAt
     * @returns PriorityJsonBean List of priorities
     * @throws ApiError
     */
    public static getPriorities1(
        maxResults: number = 100,
        query: string = '',
        projectIds?: Array<number>,
        startAt?: number,
    ): CancelablePromise<PriorityJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/priority/page',
            query: {
                'maxResults': maxResults,
                'query': query,
                'projectIds': projectIds,
                'startAt': startAt,
            },
            errors: {
                401: `Returned if the user is not authenticated`,
            },
        });
    }
    /**
     * Get an issue priority by ID
     * Returns an issue priority
     * @param id
     * @returns PriorityJsonBean Returned if the issue priority exists and is visible by the calling user. Contains a full representation of the issue priority in JSON
     * @throws ApiError
     */
    public static getPriority(
        id: string,
    ): CancelablePromise<PriorityJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/priority/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if the user is not authenticated`,
                404: `Returned if the issue priority does not exist or is not visible to the calling user`,
            },
        });
    }
}
