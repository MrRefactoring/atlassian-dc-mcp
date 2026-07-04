/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Label } from '../models/label.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentLabelsService {
    /**
     * Get labels
     * Returns the list of labels on a piece of Content. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content/1234/label`
     * - `http://example.com/confluence/rest/api/content/1234/label?prefix=global&start=0&limit=200`
     * @param id the id of the content to get the labels for
     * @param prefix the prefixes to filter the labels with.
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start he start point of the collection to return.
     * @returns any returns a JSON representation of the existing labels on the content with the given id
     * @throws ApiError
     */
    public static labels(
        id: string,
        prefix?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<{
        results?: Array<Label>;
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
            url: '/rest/api/content/{id}/label',
            path: {
                'id': id,
            },
            query: {
                'prefix': prefix,
                'limit': limit,
                'start': start,
            },
            errors: {
                404: ` Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Add Labels
     * Adds a list of labels to the specified content. The body is the json representation of the list.
     * @param id the id of the content to get the labels for
     * @param requestBody a single label object or a list of labels to add
     * @returns any returns a JSON representation of the existing and added labels on the content with the given id, or a 404 NOT FOUND if there is no content with the given id or if the user is not permitted.  An empty list will be returned if there are no labels on the given content
     * @throws ApiError
     */
    public static addLabels(
        id: string,
        requestBody?: Label,
    ): CancelablePromise<{
        results?: Array<Label>;
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
            method: 'POST',
            url: '/rest/api/content/{id}/label',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Delete label with query param
     * Deletes a labels to the specified content.
     * @param id the id of the content to get the labels for
     * @param name the name of the label to be removed from the content
     * @returns void
     * @throws ApiError
     */
    public static deleteLabelWithQueryParam(
        id: string,
        name?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/content/{id}/label',
            path: {
                'id': id,
            },
            query: {
                'name': name,
            },
            errors: {
                403: ` Returned if user has view permission, but no edit permission to the content.permission to the content.`,
                404: `Returned if content or label doesn't exist, or calling user doesn't have view permission to the content.permission to the content.`,
            },
        });
    }
    /**
     * Delete label
     * Deletes a labels to the specified content. The body is the json representation of the list. When calling this method through REST the label parameter doesn't accept `/` characters in label names, because of security constraints. For this case please use the query parameter version of this method (`/content/{id}/label?name={label}`)
     * @param id the id of the content to get the labels for
     * @param label the name of the label to be removed from the content
     * @returns void
     * @throws ApiError
     */
    public static deleteLabel(
        id: string,
        label: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/content/{id}/label/{label}',
            path: {
                'id': id,
                'label': label,
            },
            errors: {
                400: `Returned if trying to delete a label with "/" in the name.permission to the content.`,
                403: `Returned if user has view permission, but no edit permission to the content.permission to the content.`,
                404: `Returned if content or label doesn't exist, or calling user doesn't have view permission to the content.`,
            },
        });
    }
}


