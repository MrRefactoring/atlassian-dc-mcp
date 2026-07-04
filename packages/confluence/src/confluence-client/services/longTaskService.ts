/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LongTaskStatus } from '../models/longTaskStatus.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class LongTaskService {
    /**
     * Get task by ID
     * Returns information about a long-running task.
     * @param id  the key of the task to be returned.
     * @param expand a comma separated list of properties to expand on the task.
     * @returns LongTaskStatus returns a full JSON representation of a long task.
     * @throws ApiError
     */
    public static getTask(
        id: string,
        expand?: string,
    ): CancelablePromise<LongTaskStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/longtask/{id}',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `Returned if there is no task with the given key, or if the calling user does not have permission to view it`,
            },
        });
    }
    /**
     * Get tasks
     * Returns information about all tracked long-running tasks.
     * @param expand comma separated list of properties to expand on the tasks.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any returns a full JSON representation of a list of long tasks.
     * @throws ApiError
     */
    public static getTasks(
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<{
        results?: Array<LongTaskStatus>;
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
            url: '/rest/api/longtask',
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
        });
    }
}


