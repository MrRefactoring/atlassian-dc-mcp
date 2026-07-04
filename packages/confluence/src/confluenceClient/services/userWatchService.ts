/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentWatch } from '../models/contentWatch.js';
import type { SpaceWatch } from '../models/spaceWatch.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class UserWatchService {
    /**
     * Get information about content watcher
     * Get information about whether a user is watching a specified content. User is optional. If not specified, currently logged-in user will be used. Otherwise, it can be specified by either user key or username. When a user is specified and is different from the logged-in user, the logged-in user needs to be a Confluence administrator.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/watch/content/131213`
     * `http://example.com/confluence/rest/api/user/watch/content/131213?username=jblogs`
     * `http://example.com/confluence/rest/api/user/watch/content/131213?key=ff8080815a58e24c015a58e263710000`
     * @param contentId id of the content.
     * @param key userkey of the user to check for watching state.
     * @param username username of the user to check for watching state.
     * @returns any Returns a JSON representation containing the watching state.
     * @throws ApiError
     */
    public static isWatchingContent(
        contentId: string,
        key?: string,
        username?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/user/watch/content/{contentId}',
            path: {
                'contentId': contentId,
            },
            query: {
                'key': key,
                'username': username,
            },
            errors: {
                404: `Returned if no content exists for the specified content id or calling user does not have permission to perform the operation`,
            },
        });
    }
    /**
     * Add content watcher
     * Create a new watcher for the given user and content id. User is optional. If not specified, currently logged-in user will be used. Otherwise, it can be specified by either user key or username. When a user is specified and is different from the logged-in user, the logged-in user needs to be a Confluence administrator.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/watch/content/131213`
     * `http://example.com/confluence/rest/api/user/watch/content/131213?username=jblogs`
     * `http://example.com/confluence/rest/api/user/watch/content/131213?key=ff8080815a58e24c015a58e263710000`
     * @param contentId id of the content.
     * @param key userkey of the user to check for watching state.
     * @param username username of the user to check for watching state.
     * @returns ContentWatch Returned if the watcher was successfully created.
     * @throws ApiError
     */
    public static addContentWatcher(
        contentId: string,
        key?: string,
        username?: string,
    ): CancelablePromise<ContentWatch> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/user/watch/content/{contentId}',
            path: {
                'contentId': contentId,
            },
            query: {
                'key': key,
                'username': username,
            },
            errors: {
                404: `Returned if no content exists for the specified content id or the calling user does not have permission to perform the operation.`,
            },
        });
    }
    /**
     * Remove content watcher
     * Delete an existing watcher for the given user and content id. User is optional. If not specified, currently logged-in user will be used. Otherwise, it can be specified by either user key or username. When a user is specified and is different from the logged-in user, the logged-in user needs to be a Confluence administrator.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/watch/content/131213`
     * `http://example.com/confluence/rest/api/user/watch/content/131213?username=jblogs`
     * `http://example.com/confluence/rest/api/user/watch/content/131213?key=ff8080815a58e24c015a58e263710000`
     * @param contentId id of the content.
     * @param key userkey of the user to check for watching state.
     * @param username username of the user to check for watching state.
     * @returns void
     * @throws ApiError
     */
    public static removeContentWatcher(
        contentId: string,
        key?: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/user/watch/content/{contentId}',
            path: {
                'contentId': contentId,
            },
            query: {
                'key': key,
                'username': username,
            },
            errors: {
                404: `Returned if no content exists for the specified content id or the calling user does not have permission to perform the operation`,
            },
        });
    }
    /**
     * Get information about space watcher
     * Get information about whether a user is watching a specified space. User is optional. If not specified, currently logged-in user will be used. Otherwise, it can be specified by either user key or username. When a user is specified and is different from the logged-in user, the logged-in user needs to be a Confluence administrator.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?username=jblogs`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?key=ff8080815a58e24c015a58e263710000`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?contentType=blostpost`
     * @param spaceKey
     * @param contentType an optional content type to check for watching state.
     * @param key userkey of the user to check for watching state.
     * @param username username of the user to check for watching state.
     * @returns any Returns a JSON representation containing the watching state.
     * @throws ApiError
     */
    public static isWatchingSpace(
        spaceKey: string,
        contentType?: string,
        key?: string,
        username?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/user/watch/space/{spaceKey}',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'contentType': contentType,
                'key': key,
                'username': username,
            },
            errors: {
                404: `Returned if no space exists for the specified space key or the calling user does not have permission to perform the operation.`,
            },
        });
    }
    /**
     * Add space watcher
     * Create a new watcher for the given user and space key. User is optional. If not specified, currently logged-in user will be used. Otherwise, it can be specified by either user key or username. When a user is specified and is different from the logged-in user, the logged-in user needs to be a Confluence administrator.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?username=jblogs`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?key=ff8080815a58e24c015a58e263710000`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?contentType=blogpost`
     * @param spaceKey
     * @param contentType the optional content type to delete the watcher for.
     * @param key userKey of the user to create the new watcher for.
     * @param username userName of the user to create the new watcher for.
     * @returns SpaceWatch Returned if the watcher was successfully created
     * @throws ApiError
     */
    public static addSpaceWatch(
        spaceKey: string,
        contentType?: string,
        key?: string,
        username?: string,
    ): CancelablePromise<SpaceWatch> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/user/watch/space/{spaceKey}',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'contentType': contentType,
                'key': key,
                'username': username,
            },
            errors: {
                404: `Returned if no content exists for the specified space key or the calling user does not have permission to perform the operation`,
            },
        });
    }
    /**
     * Remove space watcher
     * Delete an existing watcher for the given user and space key. User is optional. If not specified, currently logged-in user will be used. Otherwise, it can be specified by either user key or username. When a user is specified and is different from the logged-in user, the logged-in user needs to be a Confluence administrator.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?username=jblogs`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?key=ff8080815a58e24c015a58e263710000`
     * `http://example.com/confluence/rest/api/user/watch/space/SPACEKEY?contentType=blogpost`
     * @param spaceKey
     * @param contentType the optional content type to delete the watcher for.
     * @param key userkey of the user to delete the watcher for.
     * @param username username of the user to delete the watcher for.
     * @returns void
     * @throws ApiError
     */
    public static removeSpaceWatch(
        spaceKey: string,
        contentType?: string,
        key?: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/user/watch/space/{spaceKey}',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'contentType': contentType,
                'key': key,
                'username': username,
            },
            errors: {
                404: `Returned if no content exists for the specified space key or the calling user does not have permission to perform the operation`,
            },
        });
    }
}


