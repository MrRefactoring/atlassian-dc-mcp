/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class MypreferencesService {
    /**
     * Get user preference by key
     * Returns preference of the currently logged in user. Preference key must be provided as input parameter (key). The value is returned exactly as it is. If key parameter is not provided or wrong - status code 404. If value is found  - status code 200.
     * @param key
     * @returns string Returns the value of one preference of currently logged in user.
     * @throws ApiError
     */
    public static getPreference(
        key?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/mypreferences',
            query: {
                'key': key,
            },
            errors: {
                404: `Key not found.`,
            },
        });
    }
    /**
     * Update user preference
     * Sets preference of the currently logged in user. Preference key must be provided as input parameters (key). Value must be provided as post body. If key or value parameter is not provided - status code 404. If preference is set - status code 204.
     * @param key
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static setPreference(
        key?: string,
        requestBody?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/mypreferences',
            query: {
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete user preference
     * Removes preference of the currently logged in user. Preference key must be provided as input parameters (key). If key parameter is not provided or wrong - status code 404. If preference is unset - status code 204.
     * @param key
     * @returns void
     * @throws ApiError
     */
    public static removePreference(
        key?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/mypreferences',
            query: {
                'key': key,
            },
        });
    }
}
