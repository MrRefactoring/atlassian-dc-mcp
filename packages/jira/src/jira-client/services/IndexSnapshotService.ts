/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IndexSnapshotBean } from '../models/IndexSnapshotBean.js';
import type { IndexSnapshotPromiseBean } from '../models/IndexSnapshotPromiseBean.js';
import type { IndexSnapshotStatusBean } from '../models/IndexSnapshotStatusBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IndexSnapshotService {
    /**
     * Get list of available index snapshots
     * Lists available index snapshots absolute paths with timestamps
     * @returns IndexSnapshotBean Returns the list consisting of absolute paths to currently available index snapshots
     * @throws ApiError
     */
    public static listIndexSnapshot(): CancelablePromise<IndexSnapshotBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/index-snapshot',
            errors: {
                401: `Returned if the caller doesn't have sufficient privileges`,
            },
        });
    }
    /**
     * Create index snapshot if not in progress
     * Starts taking an index snapshot if no other snapshot creation process is in progress
     * @returns IndexSnapshotPromiseBean Returns the absolute path which index snapshot will be placed in, after it's created
     * @throws ApiError
     */
    public static createIndexSnapshot(): CancelablePromise<IndexSnapshotPromiseBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/index-snapshot',
            errors: {
                401: `Returned if the caller doesn't have sufficient privileges`,
                409: `Returned if snapshot creation is already in progress`,
            },
        });
    }
    /**
     * Get index snapshot creation status
     * Checks if index snapshot creation is currently running
     * @returns IndexSnapshotStatusBean Returns status of current snapshot creation
     * @throws ApiError
     */
    public static isIndexSnapshotRunning(): CancelablePromise<IndexSnapshotStatusBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/index-snapshot/isRunning',
            errors: {
                401: `Returned if the caller doesn't have sufficient privileges`,
            },
        });
    }
}
