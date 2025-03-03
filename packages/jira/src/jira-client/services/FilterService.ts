/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnLayout } from '../models/ColumnLayout.js';
import type { DefaultShareScopeBean } from '../models/DefaultShareScopeBean.js';
import type { FilterBean } from '../models/FilterBean.js';
import type { FilterPermissionBean } from '../models/FilterPermissionBean.js';
import type { SharePermissionInputBean } from '../models/SharePermissionInputBean.js';
import type { StringList } from '../models/StringList.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class FilterService {
    /**
     * Create a new filter
     * Creates a new filter, and returns newly created filter. Currently sets permissions just using the users default sharing permissions
     * @param expand
     * @param requestBody
     * @returns FilterBean Returns a newly created filter
     * @throws ApiError
     */
    public static createFilter(
        expand?: StringList,
        requestBody?: FilterBean,
    ): CancelablePromise<FilterBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/filter',
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. filter name was not provided).`,
            },
        });
    }
    /**
     * Get default share scope
     * Returns the default share scope of the logged-in user
     * @returns DefaultShareScopeBean Returns the default share scope of the logged-in user
     * @throws ApiError
     */
    public static getDefaultShareScope(): CancelablePromise<DefaultShareScopeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/filter/defaultShareScope',
            errors: {
                400: `Returned if there is a problem looking up preferences for the logged-in user`,
            },
        });
    }
    /**
     * Set default share scope
     * Sets the default share scope of the logged-in user. Available values are: AUTHENTICATED (for sharing with all logged-in users) and PRIVATE (for no shares).
     * @param requestBody
     * @returns DefaultShareScopeBean Returns the new default share scope of the logged-in user
     * @throws ApiError
     */
    public static setDefaultShareScope(
        requestBody?: DefaultShareScopeBean,
    ): CancelablePromise<DefaultShareScopeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/filter/defaultShareScope',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if there is a problem setting the preferences for the logged-in user`,
            },
        });
    }
    /**
     * Get favourite filters
     * Returns the favourite filters of the logged-in user
     * @param expand
     * @returns FilterBean Returns a list of favourite filters
     * @throws ApiError
     */
    public static getFavouriteFilters(
        expand?: StringList,
    ): CancelablePromise<FilterBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/filter/favourite',
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if user is not logged-in and don't have access to any project`,
            },
        });
    }
    /**
     * Get a filter by ID
     * Returns a filter given an id
     * @param id The filter id.
     * @param expand
     * @returns FilterBean Returns a filter
     * @throws ApiError
     */
    public static getFilter(
        id: string,
        expand?: StringList,
    ): CancelablePromise<FilterBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/filter/{id}',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if user is not logged-in and don't have access to any project`,
            },
        });
    }
    /**
     * Update an existing filter
     * Updates an existing filter, and returns its new value. The following properties of a filter can be updated: 'jql', 'name', 'description'. Additionally, administrators can also update the 'owner' field. To get, set or unset 'favourite', use rest/api/1.0/filters/{id}/favourite with GET, PUT and DELETE methods instead.
     * @param id The filter id.
     * @param expand
     * @param requestBody
     * @returns FilterBean Returns the updated filter
     * @throws ApiError
     */
    public static editFilter(
        id: string,
        expand?: StringList,
        requestBody?: FilterBean,
    ): CancelablePromise<FilterBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/filter/{id}',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. filter name was not provided).`,
            },
        });
    }
    /**
     * Delete a filter
     * Delete a filter
     * @param id The ID of the filter to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteFilter(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/filter/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Returned if an error occurs.`,
                401: `Returned if the calling user is not authenticated.`,
            },
        });
    }
    /**
     * Get default columns for filter
     * Returns the default columns for the given filter. Currently logged in user will be used as the user making such request.
     * @param id The filter id.
     * @returns ColumnLayout Returns a list of columns for configured for the given user
     * @throws ApiError
     */
    public static defaultColumns1(
        id: string,
    ): CancelablePromise<ColumnLayout> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/filter/{id}/columns',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the filter does not have any columns.`,
                500: `Returned if an error occurs while retrieving the column configuration.`,
            },
        });
    }
    /**
     * Set default columns for filter
     * Sets the default columns for the given filter
     * @param id The filter id.
     * @param requestBody
     * @returns any Returned when the columns are saved successfully
     * @throws ApiError
     */
    public static setColumns1(
        id: string,
        requestBody?: {
            columns?: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/filter/{id}/columns',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                500: `Returned if an error occurs while retrieving the column configuration.`,
            },
        });
    }
    /**
     * Reset columns for filter
     * Resets the columns for the given filter such that the filter no longer has its own column config
     * @param id The filter id.
     * @returns void
     * @throws ApiError
     */
    public static resetColumns1(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/filter/{id}/columns',
            path: {
                'id': id,
            },
            errors: {
                500: `Returned if an error occurs while retrieving the column configuration.`,
            },
        });
    }
    /**
     * Get all share permissions of filter
     * Returns all share permissions of the given filter
     * @param id The filter id.
     * @returns FilterPermissionBean Returns a list of share permissions associated with the given filter
     * @throws ApiError
     */
    public static getSharePermissions(
        id: string,
    ): CancelablePromise<FilterPermissionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/filter/{id}/permission',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                404: `Returned when filter with given id does not exist or when the user does not have permissions to view the filter.`,
            },
        });
    }
    /**
     * Add share permissions to filter
     * Adds a share permissions to the given filter. Adding a global permission removes all previous permissions from the filter
     * @param id The filter id.
     * @param requestBody
     * @returns FilterPermissionBean Returns share permissions associated with the given filter
     * @throws ApiError
     */
    public static addSharePermission(
        id: string,
        requestBody?: SharePermissionInputBean,
    ): CancelablePromise<FilterPermissionBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/filter/{id}/permission',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned given permission input bean is invalid or when user does not have the permission to share filters or when the user cannot edit the given filter.`,
                401: `Returned if user is not logged in.`,
                404: `Returned when filter with given id does not exist or when the user does not have permissions to view the filter.`,
            },
        });
    }
    /**
     * Remove share permissions from filter
     * Removes a share permissions from the given filter
     * @param permissionId The permission id.
     * @param id The filter id.
     * @param permissionId
     * @returns void
     * @throws ApiError
     */
    public static deleteSharePermission(
        permissionId: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/filter/{id}/permission/{permission-id}',
            path: {
                'permissionId': permissionId,
                'id': id,
                'permission-id': permissionId,
            },
            errors: {
                404: `Returned when filter or permission with given id does not exist or when the user does not have permissions to view the filter.`,
            },
        });
    }
    /**
     * Get a single share permission of filter
     * Returns a single share permission of the given filter
     * @param permissionId The permission id.
     * @param id The filter id.
     * @returns FilterPermissionBean Returns a share permission associated with the given filter and permission-id
     * @throws ApiError
     */
    public static getSharePermission(
        permissionId: string,
        id: string,
    ): CancelablePromise<FilterPermissionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/filter/{id}/permission/{permissionId}',
            path: {
                'permissionId': permissionId,
                'id': id,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                404: `Returned when filter or permission with given id does not exist or when the user does not have permissions to view the filter.`,
            },
        });
    }
}
