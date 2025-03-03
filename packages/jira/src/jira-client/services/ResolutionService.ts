/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResolutionBean } from '../models/ResolutionBean.js';
import type { ResolutionJsonBean } from '../models/ResolutionJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ResolutionService {
    /**
     * Get all resolutions
     * Returns a list of all resolutions.
     * @returns ResolutionJsonBean Returns a list of Jira issue resolutions.
     * @throws ApiError
     */
    public static getResolutions(): CancelablePromise<ResolutionJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/resolution',
        });
    }
    /**
     * Get paginated filtered resolutions
     * Returns paginated list of filtered resolutions.
     * @param maxResults
     * @param query
     * @param startAt
     * @returns ResolutionBean Returns paginated list of resolutions.
     * @throws ApiError
     */
    public static getPaginatedResolutions(
        maxResults: number = 100,
        query: string = '',
        startAt?: number,
    ): CancelablePromise<ResolutionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/resolution/page',
            query: {
                'maxResults': maxResults,
                'query': query,
                'startAt': startAt,
            },
        });
    }
    /**
     * Get a resolution by ID
     * Returns a resolution.
     * @param id
     * @returns ResolutionJsonBean Returns a Jira issue resolution.
     * @throws ApiError
     */
    public static getResolution(
        id: string,
    ): CancelablePromise<ResolutionJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/resolution/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the resolution does not exist or the user does not have permission to view it.`,
            },
        });
    }
}
