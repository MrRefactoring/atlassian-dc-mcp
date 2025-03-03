/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IndexSummaryBean } from '../models/IndexSummaryBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IndexService {
    /**
     * Get index condition summary
     * Returns a summary of the index condition of the current node.
     * The returned data consists of:
     * - `nodeId` - Node identifier.
     * - `reportTime` - Time of this report creation.
     * - `issueIndex` - Summary of the issue index status.
     * - `replicationQueues` - Map of index replication queues, where keys represent nodes from which replication operations came from.
     *
     * `issueIndex` can contain:
     * - `indexReadable` - If `false` the endpoint failed to read data from the issue index (check Jira logs for detailed stack trace), otherwise `true`.
     * - `countInDatabase` - Count of issues found in the database.
     * - `countInIndex` - Count of issues found while querying the index.
     * - `lastUpdatedInDatabase` - Time of the last update of the issue found in the database.
     * - `lastUpdatedInIndex` - Time of the last update of the issue found while querying the index.
     * `replicationQueues`'s map values can contain:
     * - `lastConsumedOperation` - Last executed index replication operation by the current node from the sending node's queue.
     * - `lastConsumedOperation.id` - Identifier of the operation.
     * - `lastConsumedOperation.replicationTime` - Time when the operation was sent to other nodes.
     * - `lastOperationInQueue` - Last index replication operation in the sending node's queue.
     * - `lastOperationInQueue.id` - Identifier of the operation.
     * - `lastOperationInQueue.replicationTime` - Time when the operation was sent to other nodes.
     * - `queueSize` - Number of operations in the queue from the sending node to the current node.
     * @returns IndexSummaryBean Returns an object with data about the condition of the Jira node's index
     * @throws ApiError
     */
    public static getIndexSummary(): CancelablePromise<IndexSummaryBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/index/summary',
            errors: {
                403: `Returned when the current authenticated user does not have admin permission`,
            },
        });
    }
}
