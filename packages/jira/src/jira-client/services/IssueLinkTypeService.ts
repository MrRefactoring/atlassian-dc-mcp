/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IssueLinkTypeJsonBean } from '../models/IssueLinkTypeJsonBean.js';
import type { IssueLinkTypeOrderUpdateRequest } from '../models/IssueLinkTypeOrderUpdateRequest.js';
import type { IssueLinkTypeResetOrderRequest } from '../models/IssueLinkTypeResetOrderRequest.js';
import type { IssueLinkTypesBean } from '../models/IssueLinkTypesBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IssueLinkTypeService {
    /**
     * Get list of available issue link types
     * Returns a list of available issue link types, if issue linking is enabled.
     * @returns IssueLinkTypesBean Returns a list of all available issue link types.
     * @throws ApiError
     */
    public static getIssueLinkTypes(): CancelablePromise<IssueLinkTypesBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issueLinkType',
            errors: {
                401: `Returned if user is not logged-in.`,
                404: `Returned if issue linking is disabled.`,
            },
        });
    }
    /**
     * Create a new issue link type
     * Create a new issue link type.
     * @param requestBody All information about the link relationship.
     * @returns any The new issue link type has been created.
     * @throws ApiError
     */
    public static createIssueLinkType(
        requestBody: IssueLinkTypeJsonBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issueLinkType',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Returned if issue linking is disabled or you do not have permission to create issue link types.`,
            },
        });
    }
    /**
     * Reset the order of issue link types alphabetically.
     * Resets the order of issue link types alphabetically.
     * @param requestBody The sort direction for ordering the list alphabetically. Acceptable values are 'asc' or 'desc' (case-insensitive).
     * @returns IssueLinkTypesBean Returns all issue link types in reset order.
     * @throws ApiError
     */
    public static resetOrder(
        requestBody: IssueLinkTypeResetOrderRequest,
    ): CancelablePromise<IssueLinkTypesBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issueLinkType/order',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the direction is invalid.`,
                403: `Returned if the user does not have permission to do the operation.`,
                404: `Returned if issue linking is disabled.`,
            },
        });
    }
    /**
     * Get information about an issue link type
     * Returns for a given issue link type id all information about this issue link type.
     * @param issueLinkTypeId The issue link type id.
     * @returns IssueLinkTypeJsonBean Returns the issue link type with the given id.
     * @throws ApiError
     */
    public static getIssueLinkType(
        issueLinkTypeId: string,
    ): CancelablePromise<IssueLinkTypeJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issueLinkType/{issueLinkTypeId}',
            path: {
                'issueLinkTypeId': issueLinkTypeId,
            },
            errors: {
                400: `Returned if the supplied id is invalid.`,
                401: `Returned if user is not logged-in.`,
                404: `Returned if issue linking is disabled or no issue link type with the given id exists.`,
            },
        });
    }
    /**
     * Update the specified issue link type
     * Update the specified issue link type.
     * @param issueLinkTypeId The issue link type id.
     * @param requestBody All information about the link relationship.
     * @returns any Returned if the issue link type was updated successfully.
     * @throws ApiError
     */
    public static updateIssueLinkType(
        issueLinkTypeId: string,
        requestBody: IssueLinkTypeJsonBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issueLinkType/{issueLinkTypeId}',
            path: {
                'issueLinkTypeId': issueLinkTypeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the supplied id is invalid.`,
                404: `Returned if issue linking is disabled or no issue link type with the given id exists.`,
            },
        });
    }
    /**
     * Delete the specified issue link type
     * Delete the specified issue link type.
     * @param issueLinkTypeId The issue link type id.
     * @returns void
     * @throws ApiError
     */
    public static deleteIssueLinkType(
        issueLinkTypeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issueLinkType/{issueLinkTypeId}',
            path: {
                'issueLinkTypeId': issueLinkTypeId,
            },
            errors: {
                400: `Returned if the supplied id is not a number.`,
                404: `Returned if issue linking is disabled or no issue link type with the given id exists.`,
            },
        });
    }
    /**
     * Update the order of the issue link type.
     * Moves the issue link type to a new position within the list.
     * @param issueLinkTypeId Id of the issue link type to move.
     * @param requestBody The new position to move the issue link type
     * @returns IssueLinkTypeJsonBean Returns the updated issue link type.
     * @throws ApiError
     */
    public static moveIssueLinkType(
        issueLinkTypeId: string,
        requestBody: IssueLinkTypeOrderUpdateRequest,
    ): CancelablePromise<IssueLinkTypeJsonBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issueLinkType/{issueLinkTypeId}/order',
            path: {
                'issueLinkTypeId': issueLinkTypeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the position is invalid.`,
                403: `Returned if the user does not have permission to do the operation.`,
                404: `Returned if issue linking is disabled or no issue link type with the given id exists.`,
            },
        });
    }
}
