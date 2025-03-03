/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClusterState } from '../models/ClusterState.js';
import type { NodeBean } from '../models/NodeBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ClusterService {
    /**
     * @deprecated
     * Request node index snapshot
     * Request current index from node (the request is processed asynchronously). This method is deprecated as it is Lucene specific and is planned for removal in Jira 11.
     * @param nodeId ID of the node to request index from
     * @returns any Request was successful
     * @throws ApiError
     */
    public static requestCurrentIndexFromNode(
        nodeId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/cluster/index-snapshot/{nodeId}',
            path: {
                'nodeId': nodeId,
            },
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                404: `Returned if the node with this nodeID doesn't exist`,
                405: `Returned if you call this method, but don't have Jira Data Center`,
            },
        });
    }
    /**
     * Delete a cluster node
     * Delete the node from the cluster if state of node is OFFLINE.
     * @param nodeId ID of the node to delete
     * @returns void
     * @throws ApiError
     */
    public static deleteNode(
        nodeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/cluster/node/{nodeId}',
            path: {
                'nodeId': nodeId,
            },
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                404: `Returned if the node with this nodeID doesn't exist`,
                405: `Returned if you call this method, but don't have Jira Data Center`,
                500: `Returned if the server can't delete the node`,
            },
        });
    }
    /**
     * Update node state to offline
     * Change the node's state to offline if the node is reporting as active, but is not alive.
     * @param nodeId ID of the node to change state
     * @returns any State change was successful
     * @throws ApiError
     */
    public static changeNodeStateToOffline(
        nodeId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/cluster/node/{nodeId}/offline',
            path: {
                'nodeId': nodeId,
            },
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                404: `Returned if the node with this nodeID doesn't exist`,
                405: `Returned if you call this method, but don't have Jira Data Center`,
                500: `Returned if the server can't change the node's state`,
            },
        });
    }
    /**
     * Get all cluster nodes
     * Returns all nodes in cluster.
     * @returns NodeBean Returns a list of all nodes in the cluster.
     * @throws ApiError
     */
    public static getAllNodes(): CancelablePromise<NodeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/cluster/nodes',
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                405: `Returned if you call this method, but don't have Jira Data Center`,
            },
        });
    }
    /**
     * Approve cluster upgrade
     * Approves the cluster upgrade.
     * @returns any Upgrade approval was successful
     * @throws ApiError
     */
    public static approveUpgrade(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/cluster/zdu/approve',
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                409: `Returned if there is no ongoing upgrade to approve`,
            },
        });
    }
    /**
     * Cancel cluster upgrade
     * Cancels the ongoing cluster upgrade.
     * @returns any Upgrade cancellation was successful
     * @throws ApiError
     */
    public static cancelUpgrade(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/cluster/zdu/cancel',
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                409: `Returned if there is no ongoing upgrade to cancel`,
            },
        });
    }
    /**
     * Retry cluster upgrade
     * Retries the cluster upgrade.
     * @returns any Upgrade retry was successful
     * @throws ApiError
     */
    public static acknowledgeErrors(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/cluster/zdu/retryUpgrade',
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                409: `Returned if there is no failed upgrade to retry`,
            },
        });
    }
    /**
     * Start cluster upgrade
     * Starts the cluster upgrade.
     * @returns any Upgrade start was successful
     * @throws ApiError
     */
    public static setReadyToUpgrade(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/cluster/zdu/start',
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
                409: `Returned if there is already an ongoing upgrade`,
            },
        });
    }
    /**
     * Get cluster upgrade state
     * Returns the current state of the cluster upgrade.
     * @returns ClusterState Returns the current state of the cluster upgrade.
     * @throws ApiError
     */
    public static getState(): CancelablePromise<ClusterState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/cluster/zdu/state',
            errors: {
                401: `Returned if the user doesn't have admin permissions`,
            },
        });
    }
}
