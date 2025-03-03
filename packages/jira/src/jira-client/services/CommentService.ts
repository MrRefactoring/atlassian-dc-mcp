/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityPropertiesKeysBean } from '../models/EntityPropertiesKeysBean.js';
import type { EntityPropertyBean } from '../models/EntityPropertyBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CommentService {
    /**
     * Get properties keys of a comment
     * Returns the keys of all properties for the comment identified by the key or by the id.
     * @param commentId the comment from which keys will be returned.
     * @returns EntityPropertiesKeysBean Returns a list of all properties in the comment.
     * @throws ApiError
     */
    public static getPropertiesKeys1(
        commentId: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/comment/{commentId}/properties',
            path: {
                'commentId': commentId,
            },
            errors: {
                400: `Returned if the comment key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to browse the comment.`,
                404: `Returned if the comment with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Get a property from a comment
     * Returns the value of the property with a given key from the comment identified by the key or by the id. The user who retrieves the property is required to have permissions to read the comment.
     * @param propertyKey the key of the property to return.
     * @param commentId the comment from which the property will be returned.
     * @returns EntityPropertyBean Returns the value of the property with a given key from the comment.
     * @throws ApiError
     */
    public static getProperty2(
        propertyKey: string,
        commentId: string,
    ): CancelablePromise<EntityPropertyBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/comment/{commentId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'commentId': commentId,
            },
            errors: {
                400: `Returned if the comment key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to browse the comment.`,
                404: `Returned if the comment with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Set a property on a comment
     * Sets the value of the specified comment's property.
     * @param propertyKey the key of the comment's property. The maximum length of the key is 255 bytes.
     * @param commentId the comment on which the property will be set.
     * @param requestBody the request containing value of the comment's property. The value has to be a valid, non-empty JSON conforming to http://tools.ietf.org/html/rfc4627. The maximum length of the property value is 32768 bytes.
     * @returns any Returned if the comment property is successfully updated.
     * @throws ApiError
     */
    public static setProperty1(
        propertyKey: string,
        commentId: string,
        requestBody?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/comment/{commentId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'commentId': commentId,
            },
            body: requestBody,
            errors: {
                400: `Returned if the comment key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer the comment.`,
                404: `Returned if the comment with given key or id does not exist.`,
            },
        });
    }
    /**
     * Delete a property from a comment
     * Removes the property from the comment identified by the key or by the id. Ths user removing the property is required to have permissions to administer the comment.
     * @param propertyKey the key of the property to remove.
     * @param commentId the comment from which the property will be removed.
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty2(
        propertyKey: string,
        commentId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/comment/{commentId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'commentId': commentId,
            },
            errors: {
                400: `Returned if the comment key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the comment.`,
                404: `Returned if the comment with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
}
