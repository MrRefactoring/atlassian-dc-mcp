/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NodeStatus } from '../models/nodeStatus.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ClusterInformationService {
    /**
     * Get node statuses in a cluster
     * Returns a paginated list of information about each node in a cluster. Example request URI(s):
     * - `https://example.com/confluence/rest/api/cluster/nodes`
     * - `https://example.com/confluence/rest/api/cluster/nodes?start=0&limit=10`
     *
     * @param limit The limit of the number of node statuses to return, this may be restricted by fixed system limit.
     * @param start The start point of the collection to return.
     * @returns any Return a list of nodes and their status.
     * @throws ApiError
     */
    public static getClusterNodeStatuses(
        limit?: string,
        start?: string,
    ): CancelablePromise<{
        results?: Array<NodeStatus>;
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
            url: '/rest/api/cluster/nodes',
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                401: `Returned if user has not been authenticated.`,
                403: `Returned if user does not have permission to view cluster information.`,
            },
        });
    }
}


