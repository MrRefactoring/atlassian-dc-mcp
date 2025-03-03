/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkDeleteResponseBean } from '../models/BulkDeleteResponseBean.js';
import type { CustomFieldBean } from '../models/CustomFieldBean.js';
import type { CustomFieldOptionsBean } from '../models/CustomFieldOptionsBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CustomFieldsService {
    /**
     * Get custom fields with pagination
     * Returns a list of Custom Fields in the given range.
     * @param sortColumn The column by which to sort the returned custom fields.
     * @param types A list of custom field types to filter the custom fields.
     * @param search A query string used to search custom fields.
     * @param maxResults The maximum number of custom fields to return.
     * @param sortOrder The order in which to sort the returned custom fields.
     * @param screenIds A list of screen IDs to filter the custom fields.
     * @param lastValueUpdate The last value update to filter the custom fields.
     * @param projectIds A list of project IDs to filter the custom fields.
     * @param startAt The starting index of the returned custom fields.
     * @returns CustomFieldBean Returned if a custom field with the given customFieldId exists and user has permission to it.
     * @throws ApiError
     */
    public static getCustomFields(
        sortColumn?: string,
        types?: string,
        search?: string,
        maxResults?: string,
        sortOrder?: string,
        screenIds?: string,
        lastValueUpdate?: string,
        projectIds?: string,
        startAt?: string,
    ): CancelablePromise<CustomFieldBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/customFields',
            query: {
                'sortColumn': sortColumn,
                'types': types,
                'search': search,
                'maxResults': maxResults,
                'sortOrder': sortOrder,
                'screenIds': screenIds,
                'lastValueUpdate': lastValueUpdate,
                'projectIds': projectIds,
                'startAt': startAt,
            },
            errors: {
                404: `Returned if a custom field with the given customFieldId does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Delete custom fields in bulk
     * Deletes custom fields in bulk.
     * @param ids A list of custom field IDs to delete.
     * @returns BulkDeleteResponseBean Returned if at least one custom field was deleted
     * @throws ApiError
     */
    public static bulkDeleteCustomFields(
        ids: string,
    ): CancelablePromise<BulkDeleteResponseBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/customFields',
            query: {
                'ids': ids,
            },
            errors: {
                400: `Returned if no fields were removed`,
                423: `Returned if could not obtain a cluster lock`,
                503: `Returned if license or feature flag check failed`,
            },
        });
    }
    /**
     * Get custom field options
     * Returns custom field's options defined in a given context composed of projects and issue types.
     * @param customFieldId The ID of the custom field.
     * @param maxResults The maximum number of results to return.
     * @param issueTypeIds A list of issue type IDs in a context.
     * @param query A string used to filter options.
     * @param sortByOptionName Flag to sort options by their names.
     * @param useAllContexts Flag to fetch all options regardless of context, project IDs, or issue type IDs.
     * @param page The page of options to return.
     * @param projectIds A list of project IDs in a context.
     * @returns CustomFieldOptionsBean Returned if a custom field with the given customFieldId exists and user has permission to it.
     * @throws ApiError
     */
    public static getCustomFieldOptions(
        customFieldId: string,
        maxResults?: string,
        issueTypeIds?: string,
        query?: string,
        sortByOptionName?: string,
        useAllContexts?: string,
        page?: string,
        projectIds?: string,
    ): CancelablePromise<CustomFieldOptionsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/customFields/{customFieldId}/options',
            path: {
                'customFieldId': customFieldId,
            },
            query: {
                'maxResults': maxResults,
                'issueTypeIds': issueTypeIds,
                'query': query,
                'sortByOptionName': sortByOptionName,
                'useAllContexts': useAllContexts,
                'page': page,
                'projectIds': projectIds,
            },
            errors: {
                404: `Returned if a custom field with the given customFieldId does not exist or the user does not have permission to view it.`,
            },
        });
    }
}
