/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrioritySchemeBean } from '../models/PrioritySchemeBean.js';
import type { PrioritySchemeListBean } from '../models/PrioritySchemeListBean.js';
import type { PrioritySchemeUpdateBean } from '../models/PrioritySchemeUpdateBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class PriorityschemesService {
    /**
     * Get all priority schemes
     * Returns all priority schemes. All project keys associated with the priority scheme will only be returned if additional query parameter is provided <code>expand=schemes.projectKeys</code>
     * @param maxResults
     * @param startAt
     * @returns PrioritySchemeListBean Priority schemes
     * @throws ApiError
     */
    public static getPrioritySchemes(
        maxResults?: number,
        startAt?: number,
    ): CancelablePromise<PrioritySchemeListBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/priorityschemes',
            query: {
                'maxResults': maxResults,
                'startAt': startAt,
            },
            errors: {
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to view priority schemes.`,
            },
        });
    }
    /**
     * Create new priority scheme
     * Creates new priority scheme.
     * @param requestBody Data of priority scheme to create
     * @returns PrioritySchemeBean Newly created priority scheme
     * @throws ApiError
     */
    public static createPriorityScheme(
        requestBody: PrioritySchemeUpdateBean,
    ): CancelablePromise<PrioritySchemeBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/priorityschemes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to create priority scheme.`,
                500: `Returned if the priority scheme was not created because of other error.`,
            },
        });
    }
    /**
     * Get a priority scheme by ID
     * Gets a full representation of a priority scheme in JSON format.
     * @param schemeId
     * @returns PrioritySchemeBean Priority scheme
     * @throws ApiError
     */
    public static getPriorityScheme(
        schemeId: number,
    ): CancelablePromise<PrioritySchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/priorityschemes/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            errors: {
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to view priority scheme.`,
                404: `Returned if the priority scheme does not exist.`,
            },
        });
    }
    /**
     * Update a priority scheme
     * Updates a priority scheme. Update will be rejected if issue migration would be needed as a result of scheme update. Priority scheme update with migration is possible from the UI.
     * @param schemeId
     * @param requestBody New scheme data
     * @returns PrioritySchemeBean Updated priority scheme
     * @throws ApiError
     */
    public static updatePriorityScheme(
        schemeId: number,
        requestBody: PrioritySchemeUpdateBean,
    ): CancelablePromise<PrioritySchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/priorityschemes/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to update priority scheme.`,
                404: `Returned if the priority scheme does not exist.`,
                500: `Returned if the priority scheme was not updated because of other error.`,
            },
        });
    }
    /**
     * Delete a priority scheme
     * Deletes a priority scheme. All projects using deleted scheme will use default priority scheme afterwards.
     * @param schemeId
     * @returns void
     * @throws ApiError
     */
    public static deletePriorityScheme(
        schemeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/priorityschemes/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the currently authenticated user does not have permission to delete priority scheme.`,
                404: `Returned if the priority scheme does not exist.`,
            },
        });
    }
}
