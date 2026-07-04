/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Content } from '../models/content.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ChildContentService {
    /**
     * Get children of content
     * Returns a map of the direct children of a piece of Content. Content can have multiple types of children. For example, a Page can have children that are also Pages, but it can also have Comments and Attachments.
     *
     * The types of the children returned is specified by the `expand` query parameter in the request. This parameter can include expands for multiple child types. If no types are included in the `expand` parameter, the map returned will just list the child types that are available to be expanded for the content referenced by the `id` path parameter.
     * @param id The id of the content to retrieve children for
     * @param expand a comma separated list of properties to expand on the children
     * @param limit how many items should be returned after the start index
     * @param start the index of the first item within the result set that should be returned
     * @param parentVersion
     * @returns any Returned if the children are successfully retrieved. The response body contains a JSON map representing multiple ordered collections of content children, keyed by content type.
     * @throws ApiError
     */
    public static children(
        id: string,
        expand?: string,
        limit?: string,
        start?: string,
        parentVersion?: number,
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
            url: '/rest/api/content/{id}/child',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
                'parentVersion': parentVersion,
            },
            errors: {
                404: ` Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Get children of content by type
     * Returns the direct children of a piece of Content, limited to a single child type.The types of the children returned is specified by the "type" path parameter in the request.
     * @param id The id of the content to retrieve children for
     * @param type a  content type to filter children on.
     * @param expand a comma separated list of properties to expand on the children
     * @param limit how many items should be returned after the start index
     * @param start the index of the first item within the result set that should be returned
     * @param parentVersion
     * @returns any Returns a JSON map representing multiple ordered collections of content children, keyed by content type
     * @throws ApiError
     */
    public static childrenOfType(
        id: string,
        type: string,
        expand?: string,
        limit?: string,
        start?: string,
        parentVersion?: number,
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
            url: '/rest/api/content/{id}/child/{type}',
            path: {
                'id': id,
                'type': type,
            },
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
                'parentVersion': parentVersion,
            },
            errors: {
                404: ` Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Get comments of content
     * Returns the comments of a piece of Content. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content/1234/child/comment`
     * - `http://example.com/confluence/rest/api/content/1234/child/comment?expand=body.view`
     * - `http://example.com/confluence/rest/api/content/1234/child/comment?start=20&limit=10`
     * - `http://example.com/confluence/rest/api/content/1234/child/comment?location=footer&location=inline&location=resolved`
     * - `http://example.com/confluence/rest/api/content/1234/child/comment?expand=extensions.inlineProperties,extensions.resolution`
     * @param id The id of the content to retrieve children for
     * @param expand a comma separated list of properties to expand on the children
     * @param depth (optional, default: "") the depth of the comments. Possible values are: "" (ROOT only), "all"
     * @param limit how many items should be returned after the start index
     * @param start the index of the first item within the result set that should be returned
     * @param location (optional, default: "" means all) the location of the comments. Possible values are: "inline", "footer", "resolved".
     * You can define multiple location params. The results will be the comments matched by any location.
     * @param parentVersion
     * @returns any Returns a JSON map representing multiple ordered collections of content children, keyed by content type
     * @throws ApiError
     */
    public static commentsOfContent(
        id: string,
        expand?: string,
        depth?: string,
        limit?: string,
        start?: string,
        location?: string,
        parentVersion?: number,
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
            url: '/rest/api/content/{id}/child/comment',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'depth': depth,
                'limit': limit,
                'start': start,
                'location': location,
                'parentVersion': parentVersion,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to
                view the content.`,
            },
        });
    }
}


