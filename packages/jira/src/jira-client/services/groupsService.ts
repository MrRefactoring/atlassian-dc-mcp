/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupSuggestionsBean } from '../models/groupSuggestionsBean.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class GroupsService {
    /**
     * Get groups matching a query
     * Returns groups with substrings matching a given query
     * @param maxResults Maximum number of results to return
     * @param query A String to match groups against
     * @param exclude List of groups to exclude
     * @param userName Username for the context
     * @returns GroupSuggestionsBean Returns a collection of matching groups
     * @throws ApiError
     */
    public static findGroups(
        maxResults?: string,
        query?: string,
        exclude?: string,
        userName?: string,
    ): CancelablePromise<GroupSuggestionsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/groups/picker',
            query: {
                'maxResults': maxResults,
                'query': query,
                'exclude': exclude,
                'userName': userName,
            },
        });
    }
}
