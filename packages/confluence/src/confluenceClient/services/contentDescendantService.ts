/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Content } from '../models/content.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentDescendantService {
    /**
     * Get Descendants
     * Returns a map of the descendants of a piece of Content. Content can have multiple types of descendants - for example a Page can have descendants that are also Pages, but it can also have Comments and Attachments.
     *
     * The ContentType(s) of the descendants returned is specified by the `expand` query parameter in the request - this parameter can include expands for multiple descendant types. If no types are included in the expand parameter, the map returned will just list the descendant types that are available to be expanded for the Content referenced by the `id` path parameter.
     *
     * Currently the only supported descendants are comment descendants of non-comment Content.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/content/1234/descendant`
     *
     * `http://example.com/confluence/rest/api/content/1234/descendant?expand=comment.body.VIEW`
     *
     * `http://example.com/confluence/rest/api/content/1234/descendant?expand=comment`
     * @param id the ID of the Content the User is attempting to view the descendants for.
     * @param expand  a comma separated list of properties to expand on the descendants.
     * @returns any Returns a JSON map representing multiple ordered collections of content descendants,keyed by content type.
     * @throws ApiError
     */
    public static descendants(
        id: string,
        expand?: string,
    ): CancelablePromise<{
        results?: Array<Content>;
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
            url: '/rest/api/content/{id}/descendant',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Get descendants of type
     * Returns the direct descendants of a piece of Content. The ContentType(s) of the descendants returned is specified by the `type` path parameter in the request. Currently the only supported descendants are comment descendants of non-comment Content.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/content/1234/descendant/comment`
     *
     * `http://example.com/confluence/rest/api/content/1234/descendant/comment?expand=body.VIEW`
     *
     * `http://example.com/confluence/rest/api/content/1234/descendant/comment?start=20&limit=10`
     * @param id the ID of the Content the User is attempting to view the descendants for.
     * @param type  content type to filter descendants on.
     * @param expand a comma separated list of properties to expand on the descendants.
     * @param limit  (optional, default: site limit) how many items should be returned after the start index.
     * @param start (optional, default: 0) the index of the first item within the result set that should be returned.
     * @returns any Returns a JSON map representing multiple ordered collections of content descendants, keyed by content type.
     * @throws ApiError
     */
    public static descendantsOfType(
        id: string,
        type: string,
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<{
        results?: Array<Content>;
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
            url: '/rest/api/content/{id}/descendant/{type}',
            path: {
                'id': id,
                'type': type,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
}


