/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { worklog } from '../models/worklog.js';
import type { WorklogChangedSinceBean } from '../models/WorklogChangedSinceBean.js';
import type { WorklogIdsRequestBean } from '../models/WorklogIdsRequestBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class WorklogService {
    /**
     * Returns worklogs deleted since given time.
     * Returns worklogs id and delete time of worklogs that was deleted since given time. The returns set of worklogs is limited to 1000 elements. This API will not return worklogs deleted during last minute.
     * @param since
     * @returns WorklogChangedSinceBean Returns a JSON representation of the worklog changes.
     * @throws ApiError
     */
    public static getIdsOfWorklogsDeletedSince(
        since?: number,
    ): CancelablePromise<WorklogChangedSinceBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/worklog/deleted',
            query: {
                'since': since,
            },
        });
    }
    /**
     * Returns worklogs for given ids.
     * Returns worklogs for given worklog ids. Only worklogs to which the calling user has permissions, will be included in the result. The returns set of worklogs is limited to 1000 elements.
     * @param requestBody a JSON object containing ids of worklogs to return
     * @returns worklog Returns a JSON representation of the worklogs.
     * @throws ApiError
     */
    public static getWorklogsForIds(
        requestBody: WorklogIdsRequestBean,
    ): CancelablePromise<worklog> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/worklog/list',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request contains more than 1000 ids or is null`,
            },
        });
    }
    /**
     * Returns worklogs updated since given time.
     * Returns worklogs id and update time of worklogs that was updated since given time. The returns set of worklogs is limited to 1000 elements. This API will not return worklogs updated during last minute.
     * @param since
     * @returns WorklogChangedSinceBean Returns a JSON representation of the worklog changes.
     * @throws ApiError
     */
    public static getIdsOfWorklogsModifiedSince(
        since?: number,
    ): CancelablePromise<WorklogChangedSinceBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/worklog/updated',
            query: {
                'since': since,
            },
        });
    }
}
