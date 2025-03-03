/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchRequestBean } from '../models/SearchRequestBean.js';
import type { SearchResultsBean } from '../models/SearchResultsBean.js';
import type { StringList } from '../models/StringList.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SearchService {
    /**
     * Get issues using JQL
     * Searches for issues using JQL.
     * Sorting
     * the jql parameter is a full <a href="http://confluence.atlassian.com/display/JIRA/Advanced+Searching">JQL</a>
     * expression, and includes an ORDER BY clause.
     * The fields param (which can be specified multiple times) gives a comma-separated list of fields
     * to include in the response. This can be used to retrieve a subset of fields.
     * A particular field can be excluded by prefixing it with a minus.
     * By default, only navigable (*navigable) fields are returned in this search resource. Note: the default is different
     * in the get-issue resource -- the default there all fields (*all).
     * *all - include all fields
     * *navigable - include just navigable fields
     * summary,comment - include just the summary and comments
     * -description - include navigable fields except the description (the default is *navigable for search)
     * *all,-comment - include everything except comments
     * GET vs POST:
     * If the JQL query is too large to be encoded as a query param you should instead
     * POST to this resource.
     * Expanding Issues in the Search Result:
     * It is possible to expand the issues returned by directly specifying the expansion on the expand parameter passed
     * in to this resources.
     * For instance, to expand the changelog for all the issues on the search result, it is necessary to
     * specify changelog as one of the values to expand.
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns SearchResultsBean Returns a JSON representation of the search results.
     * @throws ApiError
     */
    public static search1(
        expand?: StringList,
        jql?: string,
        maxResults?: number,
        validateQuery: boolean = true,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<SearchResultsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/search',
            query: {
                'expand': expand,
                'jql': jql,
                'maxResults': maxResults,
                'validateQuery': validateQuery,
                'fields': fields,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if there is a problem with the JQL query.`,
            },
        });
    }
    /**
     * Perform search with JQL
     * Performs a search using JQL.
     * @param requestBody a JSON object containing the search request
     * @returns SearchResultsBean Returns a JSON representation of the search results.
     * @throws ApiError
     */
    public static searchUsingSearchRequest(
        requestBody: SearchRequestBean,
    ): CancelablePromise<SearchResultsBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/search',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if there is a problem with the JQL query.`,
            },
        });
    }
}
