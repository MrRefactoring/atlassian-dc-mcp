/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Label } from '../models/label.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SpaceLabelService {
    /**
     * Fetch all labels
     * Returns a paginated list of all Labels used by Content within the given Space.
     * This includes Labels used by Pages, Blog Posts, and other Content types.
     *
     * Example request URI:
     * `https://example.com/confluence/rest/api/space/TEST/labels`
     * @param spaceKey a string containing the key of the space
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any a JSON representation of the lists label, or an empty list if no labels are found.
     * @throws ApiError
     */
    public static index3(
        spaceKey: string,
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
            url: '/rest/api/space/{spaceKey}/labels',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `If the calling user does not have permission to view the given space.`,
                404: `Returned if there is no space with the given spaceKey.`,
            },
        });
    }
    /**
     * Get popular labels
     * Returns a paginated list of all Labels used by Content within the given Space.This includes Labels used by Pages, Blog Posts, and other Content types.
     *
     * Example request URI(s):
     * `https://example.com/confluence/rest/api/space/TEST/labels/popular`
     * @param spaceKey a string containing the key of the space
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any returns a JSON representation of the lists label, or an empty list if no labels are found.
     * @throws ApiError
     */
    public static popular1(
        spaceKey: string,
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
            url: '/rest/api/space/{spaceKey}/labels/popular',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `returned if the calling user does not have permission to view the given space.`,
                404: `returned if there is no space with the given spaceKey.`,
            },
        });
    }
    /**
     * Get recent labels
     * Returns a paginated list of the most recent Labels used by Content within the given Space.This includes Labels used by Pages, Blog Posts, and other Content types.
     *
     * Example request URI:
     * `https://example.com/confluence/rest/api/space/TEST/labels/recent`
     * @param spaceKey a string containing the key of the space
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any returns a full JSON representation of a piece of content.
     * @throws ApiError
     */
    public static recent1(
        spaceKey: string,
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
            url: '/rest/api/space/{spaceKey}/labels/recent',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `If the calling user does not have permission to view the given space.`,
                404: `Returned if there is no space with the given spaceKey.`,
            },
        });
    }
    /**
     * Get related labels
     * Returns a paginated list of related Labels used by Content within the given Space.A Label is defined as being related to another when it is found attached to the same Content as the Label specified in the request.
     *
     * Example request URI:
     * `https://example.com/confluence/rest/api/space/TEST/labels/example-label/related`
     * @param spaceKey a string containing the key of the space
     * @param labelName a string containing the name of the label
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any a JSON representation of the lists label, or an empty list if no labels are found.
     * @throws ApiError
     */
    public static related1(
        spaceKey: string,
        labelName: string,
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
            url: '/rest/api/space/{spaceKey}/labels/{labelName}/related',
            path: {
                'spaceKey': spaceKey,
                'labelName': labelName,
            },
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `If the calling user does not have permission to view the given space.`,
                404: `Returned if there is no space with the given spaceKey.`,
            },
        });
    }
}


