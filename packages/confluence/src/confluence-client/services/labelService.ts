/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Label } from '../models/label.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class LabelService {
    /**
     * Get list of labels matching the given label name, namespace, space (via space key) or owner.
     * Returns a paginated list of labels matching the given label name, namespace, space (via space key) or owner.
     * Leave query params empty to ignore.
     *
     * Example request URI(s):
     * `http://example.com/confluence/rest/api/label/labels?spaceKey=MYS&namespace=global&limit=3`
     * @param spaceKey The spaceKey to restrict by.
     * @param owner The owner of the labels.
     * @param start The start point of the collection to return.
     * @param limit The limit of the number of labels to return, this may be restricted by fixed system limit.
     * @param namespace The namespace of the labels.
     * @param labelName The name of the label (excluding any prefix)
     * @returns any Return a list of labels matching the given request.
     * @throws ApiError
     */
    public static labels1(
        spaceKey?: string,
        owner?: string,
        start?: string,
        limit?: string,
        namespace?: string,
        labelName?: string,
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
            url: '/rest/api/label/labels',
            query: {
                'spaceKey': spaceKey,
                'owner': owner,
                'start': start,
                'limit': limit,
                'namespace': namespace,
                'labelName': labelName,
            },
            errors: {
                400: `Return a bad request error if the given label name is invalid`,
                404: `Return a not found error if the given label name is not found`,
            },
        });
    }
    /**
     * Get most popular labels
     * Returns a paginated list of the most popular labels within a Confluence instance. This includes
     * Labels used by Pages, Blog Posts, and other Content types. Labels are sorted
     * based on number of occurrences from the most to the least used. Only global labels are considered in this list.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/label/popular`
     * `https://example.com/confluence/rest/api/label/popular?start=2&limit=1`
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any a JSON representation of a list of labels, or an empty list if no labels are found.
     * @throws ApiError
     */
    public static popular(
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
            url: '/rest/api/label/popular',
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `If the calling user does not have permission to retrieve popular labels.`,
            },
        });
    }
    /**
     * Get recently used labels
     * Returns a paginated list of recently used labels within a Confluence instance. Labels are sorted
     * from the most to the least recently used. Only global labels are considered in this list.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/label/recent`
     * `https://example.com/confluence/rest/api/label/recent?start=2&limit=1`
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits
     * @param start the start point of the collection to return.
     * @returns any a JSON representation of a list of labels, or an empty list if no labels are found.
     * @throws ApiError
     */
    public static recent(
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
            url: '/rest/api/label/recent',
            query: {
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `If the calling user does not have permission to retrieve recently used labels.`,
            },
        });
    }
    /**
     * Get related labels.
     * Return a paginated list of labels related to the given label name sorted by frequency of use in descending order.
     * The current process for identifying related labels solely
     * examines global labels, but it may change in the future.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/label/test_label_name/related`
     * `https://example.com/confluence/rest/api/label/my:test_label_name/related?limit=200`
     * @param labelName the name of the label (namespace prefixes permitted).
     * @param start the start point of the collection to return.
     * @param limit the maximum number of related labels to return. Default to be 100.
     * @returns any Return a JSON representation of related labels to the given label name
     * @throws ApiError
     */
    public static related(
        labelName: string,
        start?: string,
        limit?: string,
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
            url: '/rest/api/label/{labelName}/related',
            path: {
                'labelName': labelName,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `Return a bad request error if the given label name is invalid`,
                404: `Return a not found error if the given label name is not found`,
            },
        });
    }
}


