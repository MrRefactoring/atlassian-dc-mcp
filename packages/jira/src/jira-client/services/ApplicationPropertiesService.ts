/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Property } from '../models/Property.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ApplicationPropertiesService {
    /**
     * Get an application property by key
     * Returns an application property.
     * @param permissionLevel when fetching a list specifies the permission level of all items in the list
     * see {@link com.atlassian.jira.bc.admin.ApplicationPropertiesService.EditPermissionLevel}
     * @param key a String containing the property key.
     * @param keyFilter when fetching a list allows the list to be filtered by the property's start of key
     * e.g. "jira.lf.*" whould fetch only those permissions that are editable and whose keys start with
     * *                        "jira.lf.". This is a regex.
     * @returns Property Returned if the property exists and the currently authenticated user has permission to view it. Contains a full representation of the property.
     * @throws ApiError
     */
    public static getProperty(
        permissionLevel: string,
        key: string,
        keyFilter?: string,
    ): CancelablePromise<Property> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/application-properties',
            query: {
                'permissionLevel': permissionLevel,
                'keyFilter': keyFilter,
                'key': key,
            },
            errors: {
                403: `The action performed requires a logged in user.`,
                404: `Returned if the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all advanced settings properties
     * Returns the properties that are displayed on the "General Configuration > Advanced Settings" page.
     * @returns Property Returns all properties to display in the "General Configuration > Advanced Settings" page.
     * @throws ApiError
     */
    public static getAdvancedSettings(): CancelablePromise<Property> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/application-properties/advanced-settings',
            errors: {
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user is not an administrator.`,
            },
        });
    }
    /**
     * Update an application property
     * Update an application property via PUT. The "value" field present in the PUT will override the existing value.
     * @param id a String containing the property key.
     * @returns Property Returned if the property exists and the currently authenticated user has permission to edit it.
     * @throws ApiError
     */
    public static setPropertyViaRestfulTable(
        id: string,
    ): CancelablePromise<Property> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/application-properties/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Returned if the currently authenticated user does not have permission to edit the property.`,
                404: `Returned if the property does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
}
