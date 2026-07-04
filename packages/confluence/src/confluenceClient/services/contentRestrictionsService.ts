/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentRestriction } from '../models/contentRestriction.js';
import type { MockRestrictionsResponse } from '../models/mockRestrictionsResponse.js';
import type { OperationRestriction } from '../models/operationRestriction.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentRestrictionsService {
    /**
     * Get all restrictions by Operation
     * Returns info about all restrictions by operation.
     * @param id The id of the content
     * @param expand A comma separated list of properties to expand on the content properties. Default value: group.
     * @returns MockRestrictionsResponse Returns a JSON representation of the restrictions group by operations.
     * @throws ApiError
     */
    public static byOperation(
        id: string,
        expand?: string,
    ): CancelablePromise<MockRestrictionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/restriction/byOperation',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
            },
        });
    }
    /**
     * Get all restrictions for given operation
     * Returns info about all restrictions of given operation.
     * @param operationKey key of the operation.
     * @param id The id of the content
     * @param expand Aa comma separated list of properties to expand on the content properties. Default value: group.
     * @param limit pagination limit.
     * @param start pagination start.
     * @returns OperationRestriction Returns a JSON representation of the restrictions of given operation.
     * @throws ApiError
     */
    public static forOperation(
        operationKey: string,
        id: string,
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<OperationRestriction> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/restriction/byOperation/{operationKey}',
            path: {
                'operationKey': operationKey,
                'id': id,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
        });
    }
    /**
     * Get all view restriction both direct and inherited.
     * Returns relevant view restriction both direct and inherited for a single content.
     * @param id The id of the content
     * @param expand A comma separated list of properties to expand on the content properties. Default value: relevantViewRestrictions
     * @param limit pagination limit, Max 50 per page
     * @param start pagination start.
     * @returns MockRestrictionsResponse Returns a JSON representation of the restrictions group by operations.
     * @throws ApiError
     */
    public static relevantViewRestrictions(
        id: string,
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<MockRestrictionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/restriction/relevantViewRestrictions',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
        });
    }
    /**
     * Update restrictions
     * Sets all the restrictions specified to a piece of content identified by `contentId`. Setting per-content restrictions is currently allowed for Pages or BlogPosts only.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/content/1234567/restriction?expand=`
     *
     * The payload uses the same schema as returned by the GET requests from `/rest/api/content/{id}/restriction/byOperation*` which can be used as a template but is not necessary.
     *
     * Example request for a single content restriction:
     *
     * ```json
     * [ { "operation": "update", "restrictions": { "user": [ { "type": "known", "username": "admin" } ] } } ]
     * ```
     *
     * Example request for updating two ContentRestrictions:
     *
     * ```json
     * [ { "operation": "update", "restrictions": { "user": [ { "type": "known", "username": "admin" } ] } }, { "operation": "read", "restrictions": { "user": [ { "type": "known", "username": "fred" } ] } } ]
     * ```
     *
     * Rules for using this method:
     *
     * - The provided ContentRestrictions will overwrite any existing restrictions on the Content for the corresponding operations.
     * - If the provided `ContentRestriction` lacks any supported operations, the restrictions for the operations will not be altered.
     * - Setting `users` and/or `groups` map entries as empty arrays will remove the corresponding content restrictions.
     * - Missing `users` and/or `groups` map entries means the corresponding operation's user/group content restrictions won't be changed.
     * - Modifying restrictions to revoke the requesting user's access is prohibited.
     * @param id The id of the content
     * @param expand A comma separated list of properties to expand in the response. Default is <code>restrictions.user, restrictions.group</code> Default value: group.
     * @param limit pagination limit.
     * @param start pagination start.
     * @param requestBody
     * @returns any Returns a full JSON representation of the restrictions present directly on piece of content after the update operation.
     * @throws ApiError
     */
    public static updateRestrictions(
        id: string,
        expand?: string,
        limit?: string,
        start?: string,
        requestBody?: Array<ContentRestriction>,
    ): CancelablePromise<{
        results?: Array<OperationRestriction>;
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
            method: 'PUT',
            url: '/rest/api/content/{id}/restriction',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if any of the above validation rules are violated.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the restrictions.`,
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
}


