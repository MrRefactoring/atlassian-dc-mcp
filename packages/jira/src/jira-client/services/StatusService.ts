/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusJsonBean } from '../models/StatusJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class StatusService {
    /**
     * Get all statuses
     * Returns a list of all statuses
     * @returns StatusJsonBean Returns a list of all Jira issue statuses in JSON format, that are visible to the user.
     * @throws ApiError
     */
    public static getStatuses(): CancelablePromise<StatusJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/status',
            errors: {
                404: `Returned if the requested issue status is not found, or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get paginated filtered statuses
     * Returns paginated list of filtered statuses
     * @param issueTypeIds
     * @param maxResults
     * @param query
     * @param projectIds
     * @param startAt
     * @returns StatusJsonBean Returns paginated list of statuses.
     * @throws ApiError
     */
    public static getPaginatedStatuses(
        issueTypeIds?: Array<string>,
        maxResults: number = 100,
        query: string = '',
        projectIds?: Array<number>,
        startAt?: number,
    ): CancelablePromise<StatusJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/status/page',
            query: {
                'issueTypeIds': issueTypeIds,
                'maxResults': maxResults,
                'query': query,
                'projectIds': projectIds,
                'startAt': startAt,
            },
        });
    }
    /**
     * Get status by ID or name
     * Returns a full representation of the Status having the given id or name.
     * @param idOrName
     * @returns StatusJsonBean Returns a full representation of a Jira issue status in JSON format.
     * @throws ApiError
     */
    public static getStatus(
        idOrName: string,
    ): CancelablePromise<StatusJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/status/{idOrName}',
            path: {
                'idOrName': idOrName,
            },
            errors: {
                404: `Returned if the requested issue status is not found, or the user does not have permission to view it.`,
            },
        });
    }
}
