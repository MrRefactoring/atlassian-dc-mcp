/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonContentProperty } from '../models/jsonContentProperty.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentPropertyService {
    /**
     * Find all content properties
     * Returns a paginated list of content properties. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content/1234/property?expand=content,version`
     * @param id the id of the content
     * @param expand a comma separated list of properties to expand on the content properties. Default value: <code>version</code>.
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any returns a JSON representation of the content properties, or a 404 NOT FOUND if there is no content with the given id or if the user is not permitted..
     * @throws ApiError
     */
    public static findAll(
        id: string,
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<{
        results?: Array<JsonContentProperty>;
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
            url: '/rest/api/content/{id}/property',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                404: ` Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Create a content property
     * Creates a new content property.
     * @param id the id of the content
     * @param requestBody content property to be created.
     * @returns JsonContentProperty Returns a full JSON representation of the content property.
     * @throws ApiError
     */
    public static create1(
        id: string,
        requestBody?: JsonContentProperty,
    ): CancelablePromise<JsonContentProperty> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/content/{id}/property',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: ` Returned if the given property has a different ContentId to the one in the path, or
                if the content already has a value with the given key, or the value is missing, or the value is too long.`,
                403: ` Returned if the user does not have permission to edit the content with the given ContentId.`,
                413: `Returned if the value is too long.`,
            },
        });
    }
    /**
     * Find content property by key
     * Returns a content property. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content/1234/property/example-property-key?expand=content,version`
     * @param id the id of the content
     * @param key the key of the content property. Required.
     * @param expand a comma separated list of properties to expand on the content properties. Default value: <code>version</code>.
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @returns JsonContentProperty returns a JSON representation of the content property.
     * @throws ApiError
     */
    public static findByKey(
        id: string,
        key: string,
        expand?: string,
        limit?: string,
    ): CancelablePromise<JsonContentProperty> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/property/{key}',
            path: {
                'id': id,
                'key': key,
            },
            query: {
                'expand': expand,
                'limit': limit,
            },
            errors: {
                404: `Returned if there is no content with the given id, or no property with the given key, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Update content property
     * Updates a content property. The body contains the representation of the content property. Must include the property id, and the new version number. Attempts to create a new content property if the given version number is `1`
     * @param id the id of the content
     * @param key the key of the content property. Required.
     * @param expand a comma separated list of properties to expand on the content properties. Default value: <code>version</code>.
     * @param requestBody the content property being updated
     * @returns JsonContentProperty returns  a JSON representation of the content property, or a 404 NOT FOUND if there is no content with the given id, or no property with the given key, or if the user is not permitted.
     * @throws ApiError
     */
    public static update1(
        id: string,
        key: string,
        expand?: string,
        requestBody?: JsonContentProperty,
    ): CancelablePromise<JsonContentProperty> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/content/{id}/property/{key}',
            path: {
                'id': id,
                'key': key,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the given property has a different ContentId to the one in the path, or if the property has a different key to the one in the path, or the value is missing, or the value is too long.`,
                403: `Returned if the user does not have permission to edit the content with the given ContentId.`,
                404: `eturned if there is no content with the given id, or no property with the given key, or if the calling user does not have permission to view the content.`,
                409: `Returned if the given version is does not match the expected target version of the updated property.`,
                413: `Returned if the value is too long.`,
            },
        });
    }
    /**
     * @param id the id of the content
     * @param key
     * @param requestBody
     * @returns JsonContentProperty default response
     * @throws ApiError
     */
    public static create2(
        id: string,
        key: string,
        requestBody?: JsonContentProperty,
    ): CancelablePromise<JsonContentProperty> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/content/{id}/property/{key}',
            path: {
                'id': id,
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete content property
     * Deletes a content property.
     * @param id the id of the content
     * @param key the key of the content property. Required.
     * @returns void
     * @throws ApiError
     */
    public static delete2(
        id: string,
        key: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/content/{id}/property/{key}',
            path: {
                'id': id,
                'key': key,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
}


