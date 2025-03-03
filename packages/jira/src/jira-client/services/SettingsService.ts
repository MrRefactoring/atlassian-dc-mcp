/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnOptions } from '../models/ColumnOptions.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SettingsService {
    /**
     * Update base URL for Jira instance
     * Sets the base URL that is configured for this Jira instance.
     * @param requestBody
     * @returns any Returned when the base url is saved successfully.
     * @throws ApiError
     */
    public static setBaseUrl(
        requestBody?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/settings/baseUrl',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the specified base URL is not valid.`,
            },
        });
    }
    /**
     * Get default system columns for issue navigator
     * Returns the default system columns for issue navigator. Admin permission will be required.
     * @returns ColumnOptions Returns a list of columns for configured for the given user.
     * @throws ApiError
     */
    public static getIssueNavigatorDefaultColumns(): CancelablePromise<ColumnOptions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/settings/columns',
            errors: {
                403: `Returned if the user does not have admin permission.`,
                500: `Returned if an error occurs while retrieving the column configuration.`,
            },
        });
    }
    /**
     * Set default system columns for issue navigator using form
     * Sets the default system columns for issue navigator. Admin permission will be required.
     * @param formData
     * @returns any Returned when the columns is saved successfully.
     * @throws ApiError
     */
    public static setIssueNavigatorDefaultColumnsForm(
        formData?: {
            columns?: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/settings/columns',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                500: `Returned if an error occurs while retrieving the column configuration.`,
            },
        });
    }
}
