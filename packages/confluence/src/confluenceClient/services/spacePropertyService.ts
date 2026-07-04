/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonSpaceProperty } from '../models/jsonSpaceProperty.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SpacePropertyService {
    /**
     * Get space properties
     * Returns a paginated list of space properties.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TST/property?expand=space,version`
     * @param spaceKey The key of the space
     * @param expand a comma separated list of properties to expand on the space properties. Default value: <code>version</code>.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits.
     * @param start he start point of the collection to return.
     * @returns any a JSON representation of the space properties.
     * @throws ApiError
     */
    public static get1(
        spaceKey: string,
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<{
        results?: Array<JsonSpaceProperty>;
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
            url: '/rest/api/space/{spaceKey}/property',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                404: `Returned if there is no space with the given key, or if the calling user does not have permission to view the space.`,
            },
        });
    }
    /**
     * Create a space property
     * Creates a new space property.
     * @param spaceKey The key of the space
     * @param requestBody space property to be created
     * @returns JsonSpaceProperty Returns a full JSON representation of the space property.
     * @throws ApiError
     */
    public static create3(
        spaceKey: string,
        requestBody?: JsonSpaceProperty,
    ): CancelablePromise<JsonSpaceProperty> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/space/{spaceKey}/property',
            path: {
                'spaceKey': spaceKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the space already has a value with the given key, or no property value was provided, or the value is too long.`,
                403: `Returned if the user does not have permission to edit the space with the given key.`,
                413: `Returned if the value is too long.`,
            },
        });
    }
    /**
     * Get space property by key
     * Returns a space property.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TST/property/example-property-key?expand=space,version`
     * @param spaceKey The key of the space
     * @param key
     * @param expand a comma separated list of properties to expand on the space properties. Default value: <code>version</code>.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits.
     * @param start he start point of the collection to return.
     * @returns JsonSpaceProperty Returns a full JSON representation of the space property.
     * @throws ApiError
     */
    public static get(
        spaceKey: string,
        key: string,
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<JsonSpaceProperty> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}/property/{key}',
            path: {
                'spaceKey': spaceKey,
                'key': key,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                404: `Returned if there is no space with the given key, or no property with the given key, or if the calling user does not have permission to view the space.`,
            },
        });
    }
    /**
     * Update space property
     * Updates a space property.The body contains the representation of the space property. Must include new version number.If the given version number is 1, attempts to create a new space property.
     * @param spaceKey The key of the space
     * @param key the key of the property
     * @param requestBody space property to be updated
     * @returns JsonSpaceProperty Returns a full JSON representation of the property.
     * @throws ApiError
     */
    public static update3(
        spaceKey: string,
        key: string,
        requestBody?: JsonSpaceProperty,
    ): CancelablePromise<JsonSpaceProperty> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/property/{key}',
            path: {
                'spaceKey': spaceKey,
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the given property has a different spaceKey to the one in the path, or if the property has a different key to the one in the path, or no property value was provided, or the value is too long.`,
                403: `returned if the user does not have permission to edit the space with the given spaceKey.`,
                404: `Returned if there is no space with the given key, or no property with the given key, or if the calling user does not have permission to view the space.`,
                409: `Returned if the given version is does not match the expected target version of the updated property.`,
                413: `Returned if the value is too long.`,
            },
        });
    }
    /**
     * Create a space property with a specific key
     * Create a space property with a specific key.
     * @param spaceKey The key of the space
     * @param key property key of the property to be created
     * @param requestBody space property to be created
     * @returns JsonSpaceProperty Returns a full JSON representation of the space property.
     * @throws ApiError
     */
    public static create4(
        spaceKey: string,
        key: string,
        requestBody?: JsonSpaceProperty,
    ): CancelablePromise<JsonSpaceProperty> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/space/{spaceKey}/property/{key}',
            path: {
                'spaceKey': spaceKey,
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the space already has a value with the given key, or no property value was provided, or the value is too long.`,
                403: `Returned if the user does not have permission to edit the space with the given key.`,
                413: `Returned if the value is too long.`,
            },
        });
    }
    /**
     * Delete space property
     * Deletes a space property.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TST/property/example-property-key?expand=space,version`
     * @param spaceKey The key of the space
     * @param key the key of the property.
     * @returns void
     * @throws ApiError
     */
    public static delete4(
        spaceKey: string,
        key: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/space/{spaceKey}/property/{key}',
            path: {
                'spaceKey': spaceKey,
                'key': key,
            },
            errors: {
                404: `Returned if there is no space with the give key, property with the given property key, or if the calling user does not have permission to view the space.`,
            },
        });
    }
}


