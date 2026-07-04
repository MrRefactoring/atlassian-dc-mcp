/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Content } from '../models/content.js';
import type { History } from '../models/history.js';
import type { MacroInstance } from '../models/macroInstance.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentResourceService {
    /**
     * Get content
     * Returns a paginated list of Content. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content?spaceKey=TST&title=Cheese&expand=space,body.view,version,container`
     * - `http://example.com/confluence/rest/api/content?type=blogpost&spaceKey=TST&title=Bacon&postingDay=2014-02-13&expand=space,body.view,version,container`
     * @param spaceKey  the space key to find content under.
     * @param expand a comma separated list of properties to expand on the content. Default value: <code>history,space,version</code>.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits.
     * @param start the start point of the collection to return.
     * @param postingDay the posting day of the blog post. Required for <code>blogpost</code> type. Format: <code>yyyy-mm-dd</code>. Example: <code>2013-02-13</code>
     * @param ids a list of content ids to fetch.
     * @param title  the title of the page to find. Required for <code>page</code> type.
     * @param type the content type to return. Default value: <code>page</code>. Valid values: <code>page, blogpost</code>. All types are returned if fetching via list of IDS
     * @param status  list of statuses the content to be found is in. Defaults to current is not specified. If set to 'any', content in 'current' and 'trashed' status will be fetched. Does not support 'historical' status for now.
     * @returns any Returns a full JSON representation of a list of content.
     * @throws ApiError
     */
    public static getContent(
        spaceKey?: string,
        expand?: string,
        limit?: string,
        start?: string,
        postingDay?: string,
        ids?: string,
        title?: string,
        type?: string,
        status?: string,
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
            url: '/rest/api/content',
            query: {
                'spaceKey': spaceKey,
                'expand': expand,
                'limit': limit,
                'start': start,
                'postingDay': postingDay,
                'ids': ids,
                'title': title,
                'type': type,
                'status': status,
            },
            errors: {
                404: `Returned if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Create content
     * Creates a new piece of Content or publishes the draft if the content id is present. For the case publishing draft, a new piece of content will be created and all metadata from the draft will be transferred into the newly created content.
     * @param requestBody new content to be created.
     * @param expand  comma separated list of properties to expand on the content. Default value: <code>history,space,version</code>
     * @param status list of Content statuses to filter results on.
     *
     * Default value: <code>[current]</code>.
     * @returns Content returns a JSON representation of the content.
     * @throws ApiError
     */
    public static createContent(
        requestBody: Content,
        expand?: string,
        status?: string,
    ): CancelablePromise<Content> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/content',
            query: {
                'expand': expand,
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `returned if there is no content with the given id or if the user is not permitted.`,
            },
        });
    }
    /**
     * Get content by ID
     * Returns a piece of Content. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content/1234?expand=space,body.view,version,container`
     * - `http://example.com/confluence/rest/api/content/1234?status=any`
     * @param id the id of the content.
     * @param expand A comma separated list of properties to expand on the content. Default value: <code>history,space,version</code>.
     *
     * We can also specify some extensions such as <code>extensions.inlineProperties</code> (for getting inline comment-specific properties) or <code>extensions.resolution</code> for the resolution status of each comment in the results
     * @param version version of the content.
     * @param status list of Content statuses to filter results on.
     *
     * Default value: <code>[current]</code>.
     * @returns Content returns  a JSON representation of the content, or a 404 NOT FOUND if there is no content with the given id or if the user is not permitted.
     * @throws ApiError
     */
    public static getContentById(
        id: string,
        expand?: string,
        version?: string,
        status?: string,
    ): CancelablePromise<Content> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'version': version,
                'status': status,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Delete content
     * Trashes or purges a piece of Content, based on its ContentType and ContentStatus.
     *
     * There are three cases:
     *
     * - If the content is trashable and its status is current, it will be trashed.
     *
     * - If the content is trashable, its status is trashed and the status query parameter in the request is trashed, the content will be purged from the trash and deleted permanently.
     *
     * - If the content is not trashable it will be deleted permanently without being trashed.
     * @param id   the id of the content.
     * @param status the status of the content to be deleted.
     * @returns any Returned if successfully trashed.
     * @throws ApiError
     */
    public static delete3(
        id: string,
        status?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/content/{id}',
            path: {
                'id': id,
            },
            query: {
                'status': status,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to trash or purge the content.`,
                409: `Returned if there is a stale data object conflict when trying to delete a draft.`,
            },
        });
    }
    /**
     * Get history of content
     * Returns the history of a particular piece of content. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content/1234/history`
     * - `http://example.com/confluence/rest/api/content/1234/history?expand=previousVersion,nextVersion,lastUpdated`
     * - `http://example.com/confluence/rest/api/content/1234/history?cql=creator=currentUser()&cqlcontext={"spaceKey":"TST", "contentId":"55"}&expand=previousVersion,nextVersion,lastUpdated`
     * - `http://example.com/confluence/rest/api/content/1234/history?cql=creator=currentUser()&cqlcontext={"spaceKey":"TST", "contentId":"55"}&expand=previousVersion,nextVersion,lastUpdated&start=0&limit=10`
     * @param id   the id of the content.
     * @param expand a comma separated list of properties to expand on the content. Default value: <code>previousVersion,nextVersion,lastUpdated</code>.
     * @returns History Returns a full JSON representation of the content's history
     * @throws ApiError
     */
    public static getHistory(
        id: string,
        expand?: string,
    ): CancelablePromise<History> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/history',
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
     * @deprecated
     * Get macro body by hash
     * Returns the body of a macro (in storage format) with the given hash. This resource is primarily used by connect applications that require the body of macro to perform their work.
     *
     * The hash is generated by connect during render time of the local macro holder and is usually only relevant during the scope of one request. For optimisation purposes, this hash will usually live for multiple requests.
     *
     * Collecting a macro by its hash should now be considered deprecated and will be replaced, transparently with macroIds. This resource is currently only called from connect addons which will eventually all use the `getContentById` resource.
     *
     * To make the migration as seamless as possible, this resource will match macros against a generated hash or a stored macroId. This will allow add ons to work during the migration period.
     * @param id   the id of the content.
     * @param version the version of the content which the hash belongs.
     * @param hash the macroId to find the correct macro.
     * @returns MacroInstance Returns a json representation of a macro.
     * @throws ApiError
     */
    public static getMacroBodyByHash(
        id: string,
        version: string,
        hash: string,
    ): CancelablePromise<MacroInstance> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/history/{version}/macro/hash/{hash}',
            path: {
                'id': id,
                'version': version,
                'hash': hash,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content, or there is no macro matching the given hash or id.`,
            },
        });
    }
    /**
     * Get macro body by macro ID
     * Returns the body of a macro (in storage format) with the given id. This resource is primarily used by connect applications that require the body of macro to perform their work.
     *
     * When content is created, if no macroId is specified, then Confluence will generate a random id. The id is persisted as the content is saved and only modified by Confluence if there are conflicting IDs.
     *
     * To preserve backwards compatibility this resource will also match on the hash of the macro body, even if a macroId is found. This check will become redundant as pages get macroId's generated for them and transparently propagate out to all instances.
     * @param macroId the macroId to find the correct macro.
     * @param id   the id of the content.
     * @param version the version of the content which the hash belongs.
     * @returns MacroInstance Returns a json representation of a macro.
     * @throws ApiError
     */
    public static getMacroBodyByMacroId(
        macroId: string,
        id: string,
        version: string,
    ): CancelablePromise<MacroInstance> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/history/{version}/macro/id/{macroId}',
            path: {
                'macroId': macroId,
                'id': id,
                'version': version,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content, or there is no macro matching the given id or hash.`,
            },
        });
    }
    /**
     * Scan content by space key
     * Returns a paginated list of Content. Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/content/scan?spaceKey=TST&limit=100&expand=space,body.view,version,container`
     * - `http://example.com/confluence/rest/api/content/scan?limit=100&expand=space,body.view,version,container`
     * @param cursor the identifier which is used to skip results from a previous query when paginating. Cursor is empty in first request, to move forward or backward use cursor provided in response.
     * @param spaceKey  the space key to find content under.
     * @param expand a comma separated list of properties to expand on the content. Default value: <code>history,space,version</code>.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits.
     * @param type the content type to return. Default value: <code>page</code>. Valid values: <code>page, blogpost, comment</code>. All types are returned if fetching via list of IDS. Type is only required for first request, latest request will user cursor
     * @param status  list of statuses the content to be found is in. Defaults to current is not specified. If set to 'any', content in 'current' and 'trashed' status will be fetched. Does not support 'historical' status for now.
     * @returns any returns a JSON representation of the list of content.
     * @throws ApiError
     */
    public static scanContent(
        cursor?: string,
        spaceKey?: string,
        expand?: string,
        limit?: string,
        type?: string,
        status?: string,
    ): CancelablePromise<{
        nextCursor?: string;
        prevCursor?: string;
        results?: Array<Content>;
        totalCount?: number;
        cursor?: string;
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
            url: '/rest/api/content/scan',
            query: {
                'cursor': cursor,
                'spaceKey': spaceKey,
                'expand': expand,
                'limit': limit,
                'type': type,
                'status': status,
            },
            errors: {
                400: `returned if the cursor is invalid.`,
                404: `returned if the user is not permitted.`,
            },
        });
    }
    /**
     * Search content using CQL
     * Fetch a list of content using the Confluence Query Language (CQL). See: [Advanced searching using CQL](https://developer.atlassian.com/display/CONFDEV/Advanced+Searching+using+CQL)
     *
     * Example request URI(s):
     *
     * - `http://localhost:8080/confluence/rest/api/content/search?cql=creator=currentUser()&cqlcontext={"spaceKey":"TST", "contentId":"55"}`
     * - `http://localhost:8080/confluence/rest/api/content/search?cql=space=DEV AND label=docs&expand=space,metadata.labels&limit=10`
     * @param cqlcontext  the context to execute a cql search in, this is the json serialized form of SearchContext
     * @param expand a comma separated list of properties to expand on the content. Default value: <code>history,space,version</code>.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits.
     * @param start the start point of the collection to return.
     * @param cql   a cql query string to use to locate content.
     * @returns any returns a paginated list of content.
     * @throws ApiError
     */
    public static search(
        cqlcontext?: string,
        expand?: string,
        limit?: string,
        start?: string,
        cql?: string,
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
            url: '/rest/api/content/search',
            query: {
                'cqlcontext': cqlcontext,
                'expand': expand,
                'limit': limit,
                'start': start,
                'cql': cql,
            },
            errors: {
                404: `Returned if the CQL is invalid or missing.`,
            },
        });
    }
    /**
     * Update content
     * Updates a piece of Content, including changes to content status.
     *
     * To update a piece of content you must increment the `version.number`, supplying the number of the version you are creating. The `title` property can be updated on all content, `body` can be updated on all content that has a body (not attachments). For instance to update the content of a blogpost that currently has version 1:
     *
     * `PUT /rest/api/content/456`
     *
     * ```json
     * {
         * "version":{
             * "number": 2
             * },
             * "title":"My new title",
             * "type":"page",
             * "body":{
                 * "storage":{
                     * "value":"<p>New page data.</p>",
                     * "representation":"storage"
                     * }
                     * }
                     * }
                     * ```
                     *
                     * To update a page and change its parent page, supply the `ancestors` property with the request with the parent as the first ancestor i.e. to move a page to be a child of page with ID 789:
                     *
                     * `PUT /rest/api/content/456`
                     *
                     * ```json
                     * {
                         * "version":{
                             * "number": 2
                             * },
                             * "ancestors": [{"id":789}],
                             * "type":"page",
                             * "body":{
                                 * "storage":{
                                     * "value":"<p>New page data.</p>",
                                     * "representation":"storage"
                                     * }
                                     * }
                                     * }
                                     * ```
                                     *
                                     * Changing status
                                     *
                                     * To restore a piece of content that has the status of trashed the content must have it's `version` incremented, and `status` set to `current`. No other field modifications will be performed when restoring a piece of content from the trash.
                                     *
                                     * Request example to restore from trash: `{"id": "557059","status": "current","version": {"number": 2}}`
                                     *
                                     * If the content you're updating has a draft, specifying `status=draft` will delete that draft and the `body` of the content will be replaced with the `body` specified in the request.
                                     *
                                     * Request example to delete a draft:
                                     *
                                     * `PUT:  http://localhost:9096/confluence/rest/api/content/2149384202?status=draft`
                                     *
                                     * ```json
                                     * {
                                         * "id":"2149384202",
                                         * "status":"current",
                                         * "version":{
                                             * "number":4
                                             * },
                                             * "space":{
                                                 * "key":"TST"
                                                 * },
                                                 * "type":"page",
                                                 * "title":"page title",
                                                 * "body":{
                                                     * "storage":{
                                                         * "value":"<p>New page data.</p>",
                                                         * "representation":"storage"
                                                         * }
                                                         * }
                                                         * }
                                                         * ```
                                                         *
                                                         * Changing page position
                                                         *
                                                         * To set page position, supply the `position` property in the request body with a positive integer. Content with unset positions will have a `position` value of -1. To unset a content position, supply `position` property with -1.
                                                         *
                                                         * Request example to set page position to 1
                                                         *
                                                         * `PUT /rest/api/content/2149384202`
                                                         *
                                                         * ```json
                                                         * {
                                                             * "id":"2149384202",
                                                             * "version":{
                                                                 * "number":2
                                                                 * },
                                                                 * "type":"page",
                                                                 * "title":"page title",
                                                                 * "position":1
                                                                 * }
                                                                 * ```
                                                                 *
                                                                 * Request example to unset page position
                                                                 *
                                                                 * `PUT /rest/api/content/2149384202`
                                                                 *
                                                                 * ```json
                                                                 * {
                                                                     * "id":"2149384202",
                                                                     * "version":{
                                                                         * "number":2
                                                                         * },
                                                                         * "type":"page",
                                                                         * "position":-1
                                                                         * }
                                                                         * ```
                                                                         *
                                                                         *
                                                                         * @param contentId   the id of the content.
                                                                         * @param requestBody new content to be created.
                                                                         * @param asyncReconciliation
                                                                         * @param conflictPolicy the conflict policy, default value: <code>abort<code>
                                                                         * @param status the existing status of the content to be updated.
                                                                         * @returns Content Returns a full JSON representation of a piece of content.
                                                                         * @throws ApiError
                                                                         */
                                                                        public static update2(
                                                                            contentId: string,
                                                                            requestBody: Content,
                                                                            asyncReconciliation: boolean = false,
                                                                            conflictPolicy?: string,
                                                                            status?: string,
                                                                        ): CancelablePromise<Content> {
                                                                            return __request(OpenAPI, {
                                                                                method: 'PUT',
                                                                                url: '/rest/api/content/{contentId}',
                                                                                path: {
                                                                                    'contentId': contentId,
                                                                                },
                                                                                query: {
                                                                                    'asyncReconciliation': asyncReconciliation,
                                                                                    'conflictPolicy': conflictPolicy,
                                                                                    'status': status,
                                                                                },
                                                                                body: requestBody,
                                                                                mediaType: 'application/json',
                                                                                errors: {
                                                                                    400: `Returned if no space or no content type, or setup a wrong version type set to content, or status param is not draft and status content is current`,
                                                                                    404: `Returned if can not find draft with current content.`,
                                                                                },
                                                                            });
                                                                        }
                                                                    }


