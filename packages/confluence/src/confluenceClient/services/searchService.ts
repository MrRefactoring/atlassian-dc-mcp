/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchResult } from '../models/searchResult.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SearchService {
    /**
     * Search for entities in confluence
     * Search for entities in Confluence using the [Confluence Query Language (CQL)](https://developer.atlassian.com/confdev/confluence-rest-api/advanced-searching-using-cql). For example:
     *
     * Example request URI(s):
     *
     * - `http://localhost:8080/confluence/rest/api/search?cql=creator=currentUser()&type%20in%20(space,page,user)&cqlcontext={"spaceKey":"TST", "contentId":"55"}`
     *
     * - `http://localhost:8080/confluence/rest/api/search?cql=siteSearch~'example'%20AND%20label=docs&expand=content.space,space.homepage&limit=10`
     * @param cqlcontext the execution context for CQL functions, provides current space key and content id. If this is not provided some CQL functions will not be available.
     * @param expand the properties to expand on the search result, this may cause database requests for some properties
     * @param includeArchivedSpaces whether to include content in archived spaces in the result, this defaults to false.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits.
     * @param start he start point of the collection to return.
     * @param excerpt the excerpt strategy to apply to the result, one of : indexed, highlight, none. This defaults to highlight.
     * @param cql the CQL query see <a href='https://developer.atlassian.com/confdev/confluence-rest-api/advanced-searching-using-cql'>advanced searching in confluence using CQL</a>
     * @param requestBody
     * @returns any returns a full JSON representation of a list of search results.
     * @throws ApiError
     */
    public static search1(
        cqlcontext?: string,
        expand?: string,
        includeArchivedSpaces?: string,
        limit?: string,
        start?: string,
        excerpt?: string,
        cql?: string,
        requestBody?: string,
    ): CancelablePromise<{
        results?: Array<SearchResult>;
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
            url: '/rest/api/search',
            query: {
                'cqlcontext': cqlcontext,
                'expand': expand,
                'includeArchivedSpaces': includeArchivedSpaces,
                'limit': limit,
                'start': start,
                'excerpt': excerpt,
                'cql': cql,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `returned if the query cannot be parsed`,
            },
        });
    }
}


