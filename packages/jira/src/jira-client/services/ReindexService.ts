/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReindexBean } from '../models/ReindexBean.js';
import type { ReindexRequestBean } from '../models/ReindexRequestBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ReindexService {
    /**
     * Get reindex information
     * Returns information on the system reindexes. If a reindex is currently taking place then information about this reindex is returned. If there is no active index task, then returns information about the latest reindex task run, otherwise returns a 404 indicating that no reindex has taken place.
     * @param taskId
     * @returns ReindexBean Returns a representation of the progress of the re-index operation.
     * @throws ApiError
     */
    public static getReindexInfo(
        taskId?: number,
    ): CancelablePromise<ReindexBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/reindex',
            query: {
                'taskId': taskId,
            },
            errors: {
                404: `Returned if there is no re-indexing task found`,
            },
        });
    }
    /**
     * Start a reindex operation
     * Kicks off a reindex. Need Admin permissions to perform this reindex.
     * @param indexChangeHistory
     * @param type
     * @param indexWorklogs
     * @param indexComments
     * @returns ReindexBean Returns a representation of the progress of the re-index operation.
     * @throws ApiError
     */
    public static reindex(
        indexChangeHistory: boolean = false,
        type?: string,
        indexWorklogs: boolean = false,
        indexComments: boolean = false,
    ): CancelablePromise<ReindexBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/reindex',
            query: {
                'indexChangeHistory': indexChangeHistory,
                'type': type,
                'indexWorklogs': indexWorklogs,
                'indexComments': indexComments,
            },
        });
    }
    /**
     * Reindex individual issues
     * Reindexes one or more individual issues. Indexing is performed synchronously - the call returns when indexing of the issues has completed or a failure occurs.
     * @param issueId
     * @param indexChangeHistory
     * @param indexWorklogs
     * @param indexComments
     * @returns ReindexBean Returns response indicating reindex time.
     * @throws ApiError
     */
    public static reindexIssues(
        issueId?: Array<string>,
        indexChangeHistory: boolean = false,
        indexWorklogs: boolean = false,
        indexComments: boolean = false,
    ): CancelablePromise<ReindexBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/reindex/issue',
            query: {
                'issueId': issueId,
                'indexChangeHistory': indexChangeHistory,
                'indexWorklogs': indexWorklogs,
                'indexComments': indexComments,
            },
        });
    }
    /**
     * Get reindex progress
     * Returns information on the system reindexes. If a reindex is currently taking place then information about this reindex is returned. If there is no active index task, then returns information about the latest reindex task run, otherwise returns a 404 indicating that no reindex has taken place.
     * @param taskId
     * @returns ReindexBean Returns a representation of the progress of the re-index operation.
     * @throws ApiError
     */
    public static getReindexProgress(
        taskId?: number,
    ): CancelablePromise<ReindexBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/reindex/progress',
            query: {
                'taskId': taskId,
            },
            errors: {
                404: `Returned if there is no re-indexing task found`,
            },
        });
    }
    /**
     * Execute pending reindex requests
     * Executes any pending reindex requests. Execution is asynchronous - progress of the returned tasks can be monitored through other REST calls.
     * @returns number Returns an array containing the reindex request IDs being processed.
     * @throws ApiError
     */
    public static processRequests(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/reindex/request',
            errors: {
                401: `Returned if the user is not authorized to process reindex requests.`,
                500: `Returned if there is an error processing reindex requests.`,
            },
        });
    }
    /**
     * Get progress of multiple reindex requests
     * Retrieves the progress of multiple reindex requests. Only reindex requests that actually exist will be returned in the results.
     * @param requestId
     * @returns ReindexRequestBean An array of results describing the progress of each of the found requests.
     * @throws ApiError
     */
    public static getProgressBulk(
        requestId?: Array<number>,
    ): CancelablePromise<ReindexRequestBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/reindex/request/bulk',
            query: {
                'requestId': requestId,
            },
        });
    }
    /**
     * Get progress of a single reindex request
     * Retrieves the progress of a single reindex request.
     * @param requestId
     * @returns ReindexRequestBean Details and status of the reindex request.
     * @throws ApiError
     */
    public static getProgress(
        requestId: number,
    ): CancelablePromise<ReindexRequestBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/reindex/request/{requestId}',
            path: {
                'requestId': requestId,
            },
            errors: {
                404: `Returned if no such reindex request exists.`,
            },
        });
    }
}
