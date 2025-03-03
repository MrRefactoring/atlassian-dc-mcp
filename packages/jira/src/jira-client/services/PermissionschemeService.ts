/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionGrantBean } from '../models/PermissionGrantBean.js';
import type { PermissionGrantsBean } from '../models/PermissionGrantsBean.js';
import type { PermissionSchemeAttributeBean } from '../models/PermissionSchemeAttributeBean.js';
import type { PermissionSchemeBean } from '../models/PermissionSchemeBean.js';
import type { PermissionSchemesBean } from '../models/PermissionSchemesBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class PermissionschemeService {
    /**
     * Get all permission schemes
     * Returns a list of all permission schemes. By default only shortened beans are returned. If you want to include permissions of all the schemes, then specify the permissions expand parameter. Permissions will be included also if you specify any other expand parameter.
     * @param expand
     * @returns PermissionSchemesBean List of all permission schemes
     * @throws ApiError
     */
    public static getPermissionSchemes(
        expand?: string,
    ): CancelablePromise<PermissionSchemesBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/permissionscheme',
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to view permission schemes.`,
                404: `Returned if the scheme doesn't exist.`,
            },
        });
    }
    /**
     * Create a new permission scheme
     * Create a new permission scheme. This method can create schemes with a defined permission set, or without.
     * @param expand
     * @param requestBody
     * @returns PermissionSchemeBean Returned if the scheme is created successfully.
     * @throws ApiError
     */
    public static createPermissionScheme(
        expand?: string,
        requestBody?: PermissionSchemeBean,
    ): CancelablePromise<PermissionSchemeBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/permissionscheme',
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to create permission schemes.`,
            },
        });
    }
    /**
     * Get scheme attribute by key
     * Returns the attribute for a permission scheme specified by permission scheme id and attribute key.
     * @param permissionSchemeId
     * @param attributeKey
     * @returns PermissionSchemeAttributeBean Permission scheme attribute
     * @throws ApiError
     */
    public static getSchemeAttribute(
        permissionSchemeId: number,
        attributeKey: string,
    ): CancelablePromise<PermissionSchemeAttributeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/permissionscheme/{permissionSchemeId}/attribute/{attributeKey}',
            path: {
                'permissionSchemeId': permissionSchemeId,
                'attributeKey': attributeKey,
            },
            errors: {
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the user is not an admin.`,
                404: `Returned if there is no such attribute.`,
            },
        });
    }
    /**
     * Update or insert a scheme attribute
     * Updates or inserts the attribute for a permission scheme specified by permission scheme id. The attribute consists of the key and the value. The value will be converted to Boolean using Boolean#valueOf.
     * @param permissionSchemeId
     * @param key
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static setSchemeAttribute(
        permissionSchemeId: number,
        key: string,
        requestBody?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/permissionscheme/{permissionSchemeId}/attribute/{key}',
            path: {
                'permissionSchemeId': permissionSchemeId,
                'key': key,
            },
            body: requestBody,
            mediaType: 'text/plain',
            errors: {
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the user is not an admin.`,
                500: `Returned if there was an error related to attribute upsert.`,
            },
        });
    }
    /**
     * Get a permission scheme by ID
     * Returns a permission scheme identified by the given id.
     * @param schemeId
     * @param expand
     * @returns PermissionSchemeBean Permission scheme
     * @throws ApiError
     */
    public static getPermissionScheme(
        schemeId: number,
        expand?: string,
    ): CancelablePromise<PermissionSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/permissionscheme/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to view permission schemes.`,
                404: `Returned if the scheme doesn't exist.`,
            },
        });
    }
    /**
     * Update a permission scheme
     * Updates a permission scheme. If the permissions list is present then it will be set in the permission scheme, which basically means it will overwrite any permission grants that existed in the permission scheme. Sending an empty list will remove all permission grants from the permission scheme. To update just the name and description, do not send permissions list at all. To add or remove a single permission grant instead of updating the whole list at once use the {schemeId}/permission/ resource.
     * @param schemeId
     * @param expand
     * @param requestBody
     * @returns PermissionSchemeBean Returned if the scheme is updated successfully.
     * @throws ApiError
     */
    public static updatePermissionScheme(
        schemeId: number,
        expand?: string,
        requestBody?: PermissionSchemeBean,
    ): CancelablePromise<PermissionSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/permissionscheme/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to edit permission schemes.`,
                404: `Returned if the permission is not found.`,
            },
        });
    }
    /**
     * Delete a permission scheme by ID
     * Deletes a permission scheme identified by the given id.
     * @param schemeId
     * @returns void
     * @throws ApiError
     */
    public static deletePermissionScheme(
        schemeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/permissionscheme/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to delete permission schemes.`,
            },
        });
    }
    /**
     * Get all permission grants of a scheme
     * Returns all permission grants of the given permission scheme.
     * @param schemeId
     * @param expand
     * @returns PermissionGrantsBean Permission grants
     * @throws ApiError
     */
    public static getPermissionSchemeGrants(
        schemeId: number,
        expand?: string,
    ): CancelablePromise<PermissionGrantsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/permissionscheme/{schemeId}/permission',
            path: {
                'schemeId': schemeId,
            },
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to view permission schemes.`,
                404: `Returned if the scheme doesn't exist.`,
            },
        });
    }
    /**
     * Create a permission grant in a scheme
     * Creates a permission grant in a permission scheme.
     * @param schemeId
     * @param expand
     * @param requestBody
     * @returns PermissionGrantBean Returned if the scheme permission is created successfully.
     * @throws ApiError
     */
    public static createPermissionGrant(
        schemeId: number,
        expand?: string,
        requestBody?: PermissionGrantBean,
    ): CancelablePromise<PermissionGrantBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/permissionscheme/{schemeId}/permission',
            path: {
                'schemeId': schemeId,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to edit permission schemes.`,
            },
        });
    }
    /**
     * Get a permission grant by ID
     * Returns a permission grant identified by the given id.
     * @param permissionId
     * @param schemeId
     * @param expand
     * @returns PermissionGrantBean Permission grant
     * @throws ApiError
     */
    public static getPermissionSchemeGrant(
        permissionId: number,
        schemeId: number,
        expand?: string,
    ): CancelablePromise<PermissionGrantBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/permissionscheme/{schemeId}/permission/{permissionId}',
            path: {
                'permissionId': permissionId,
                'schemeId': schemeId,
            },
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to view permission schemes.`,
                404: `Returned if the scheme doesn't exist.`,
            },
        });
    }
    /**
     * Delete a permission grant from a scheme
     * Deletes a permission grant from a permission scheme.
     * @param permissionId
     * @param schemeId
     * @returns void
     * @throws ApiError
     */
    public static deletePermissionSchemeEntity(
        permissionId: number,
        schemeId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/permissionscheme/{schemeId}/permission/{permissionId}',
            path: {
                'permissionId': permissionId,
                'schemeId': schemeId,
            },
            errors: {
                401: `Returned if user is not logged in.`,
                403: `Returned if user is not allowed to edit permission schemes.`,
            },
        });
    }
}
