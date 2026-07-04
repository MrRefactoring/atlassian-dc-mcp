/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Content } from '../models/content.js';
import type { LongTaskSubmission } from '../models/longTaskSubmission.js';
import type { PersonalSpaceDetailsForCreation } from '../models/personalSpaceDetailsForCreation.js';
import type { Space } from '../models/space.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SpaceService {
    /**
     * Archive space
     * Archive the given Space identified by spaceKey. This method is idempotent i.e., if the Space is already archived then no action will be taken.
     * @param spaceKey the key of the space to update.
     * @returns void
     * @throws ApiError
     */
    public static archive(
        spaceKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/archive',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the Space.`,
                404: ` Returned if there is no space with the given key, or if the calling user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get contents in space
     * Returns the content in this given space.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TEST/content?expand=history`
     * @param spaceKey the key of the space to update.
     * @param expand a comma separated list of properties to expand on the space.
     * @param depth a string indicating if all content, or just the root content of the space is returned. Default value: <code>all</code>. Valid values: <code>all, root</code>.
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits.
     * @param start he start point of the collection to return.
     * @returns any Returns a full JSON representation of a piece of content.
     * @throws ApiError
     */
    public static contents(
        spaceKey: string,
        expand?: string,
        depth?: string,
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
            url: '/rest/api/space/{spaceKey}/content',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'expand': expand,
                'depth': depth,
                'limit': limit,
                'start': start,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Get trash contents of space
     * Returns the trash contents in this given space.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TEST/trash?limit=100&cursor=content:false:612345`
     * @param spaceKey the key of the space to update.
     * @param cursor the identifier which is used to skip results from a previous query when paginating. Cursor is empty in first request, to move forward or backward use cursor provided in response.
     * @param expand a comma separated list of properties to expand on the space.
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits.
     * @returns any Returns an array of full JSON representations of trash contents.
     * @throws ApiError
     */
    public static contentsWithType(
        spaceKey: string,
        cursor?: string,
        expand?: string,
        limit?: string,
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
            url: '/rest/api/space/{spaceKey}/trash',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'cursor': cursor,
                'expand': expand,
                'limit': limit,
            },
            errors: {
                403: `Returned if the calling user does not have admin permission of the Space.`,
                404: `Returned if space not found by space key.`,
            },
        });
    }
    /**
     * Remove all trash contents
     * Remove all content from the trash in the given space, deleting them permanently.Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TEST/trash`
     * @param spaceKey the key of the space to update.
     * @returns void
     * @throws ApiError
     */
    public static trash(
        spaceKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/space/{spaceKey}/trash',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                403: `Returned if user does not have correct permission`,
                404: `Returned if there is no space with the given key`,
            },
        });
    }
    /**
     * Get contents by type
     * Returns the content in this given space with the given type.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TEST/content/page?expand=history`
     * @param spaceKey the key of the space to update.
     * @param type the type of content to return with the space. Valid values: <code>page, blogpost</code>.
     * @param expand a comma separated list of properties to expand on the space.
     * @param depth a string indicating if all content, or just the root content of the space is returned. Default value: <code>all</code>. Valid values: <code>all, root</code>.
     * @param limit the limit of the number of labels to return, this may be restricted by fixed system limits.
     * @param start he start point of the collection to return.
     * @returns any Returns a full JSON representation of a piece of content.
     * @throws ApiError
     */
    public static contentsWithType1(
        spaceKey: string,
        type: string,
        expand?: string,
        depth?: string,
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
            url: '/rest/api/space/{spaceKey}/content/{type}',
            path: {
                'spaceKey': spaceKey,
                'type': type,
            },
            query: {
                'expand': expand,
                'depth': depth,
                'limit': limit,
                'start': start,
            },
            errors: {
                404: `Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Creates the personal Space for self.
     * Creates a personal space for self.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/personal`
     * @param requestBody The personal space to be created
     * @returns Space Returns a full JSON representation of a space.
     * @throws ApiError
     */
    public static createPersonalSpace1(
        requestBody: PersonalSpaceDetailsForCreation,
    ): CancelablePromise<Space> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/space/personal',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if there is invalid space description.`,
                403: `Returned if current user does not have correct permission.`,
                409: `Returned if personal space already exists for user.`,
            },
        });
    }
    /**
     * Create private space
     * Creates a new private Space, viewable only by its creator. The incoming Space does not include an id, but must include a Key and Name, and should include a Description.
     * @param requestBody The space to be created
     * @returns Space Returns a full JSON representation of a space.
     * @throws ApiError
     */
    public static createPrivateSpace(
        requestBody: Space,
    ): CancelablePromise<Space> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/space/_private',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get spaces by key
     * Returns information about a number of spaces.
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/space?spaceKey=TST&spaceKey=ds`
     * @param spaceKeySingle
     * @param start the start point of the collection to return.
     * @param label filter the list of spaces returned by label.
     * @param favourite filter the list of spaces returned by favourites.
     * @param type filter the list of spaces returned by type (global, personal).
     * @param spaceKey the key of the space to fetch information from.
     * @param spaceId
     * @param expand a comma separated list of properties to expand on the spaces.
     * @param hasRetentionPolicy filter the list of spaces returned by retention policy.
     * @param limit the limit of the number of spaces to return, this may be restricted by fixed system limits
     * @param spaceKeys the keys of the spaces to fetch information from.
     * @param contentLabel filter the list of spaces returned by content containing provided label.
     * @param spaceIds the ids of the spaces to fetch information from. Cannot be used in conjunction with spaceKey(s)
     * @param status filter the list of spaces returned by status (current, archived).
     * @param requestBody
     * @returns any Returns an array of full JSON representations of found space.
     * @throws ApiError
     */
    public static spaces(
        spaceKeySingle?: string,
        start?: string,
        label?: string,
        favourite?: string,
        type?: string,
        spaceKey?: string,
        spaceId?: Array<string>,
        expand?: string,
        hasRetentionPolicy?: string,
        limit?: string,
        spaceKeys?: string,
        contentLabel?: string,
        spaceIds?: string,
        status?: string,
        requestBody?: string,
    ): CancelablePromise<{
        results?: Array<Space>;
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
            url: '/rest/api/space',
            query: {
                'spaceKeySingle': spaceKeySingle,
                'start': start,
                'label': label,
                'favourite': favourite,
                'type': type,
                'spaceKey': spaceKey,
                'spaceId': spaceId,
                'expand': expand,
                'hasRetentionPolicy': hasRetentionPolicy,
                'limit': limit,
                'spaceKeys': spaceKeys,
                'contentLabel': contentLabel,
                'spaceIds': spaceIds,
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Creates a new Space.
     * Creates a new Space. The incoming Space does not include an id, but must include a Key and Name, and should include a Description.
     * @param requestBody The space to be created
     * @returns Space Returns a full JSON representation of a space.
     * @throws ApiError
     */
    public static createSpace(
        requestBody: Space,
    ): CancelablePromise<Space> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/space',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get space
     * Returns information about a space.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/space/TST?expand=description`
     * @param spaceKey the key of the space to update.
     * @param expand a comma separated list of properties to expand on the space.
     * @returns Space Returns a full JSON representation of a space.
     * @throws ApiError
     */
    public static space(
        spaceKey: string,
        expand?: string,
    ): CancelablePromise<Space> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}',
            path: {
                'spaceKey': spaceKey,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `Returned if there is no space with the given key, or if the calling user does not have permission to view the space.`,
            },
        });
    }
    /**
     * Update Space
     * Updates a Space. The incoming Space must include a Key and Name, and should include a Description
     * @param spaceKey the key of the space to update.
     * @param requestBody the space being updated
     * @returns Space Returns a full JSON representation of a space.
     * @throws ApiError
     */
    public static update4(
        spaceKey: string,
        requestBody: Space,
    ): CancelablePromise<Space> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}',
            path: {
                'spaceKey': spaceKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Returned if there is no space with the given key, or if the calling userdoes not have permission to update it.`,
            },
        });
    }
    /**
     * Delete Space
     * Deletes a Space. The space is deleted in a long running task, so the space cannot be considered deleted when this resource returns. Clients can follow the status link in the response and poll it until the task completes.
     * @param spaceKey the key of the space to update.
     * @returns LongTaskSubmission Returns a pointer to the status of the space-deletion task.
     * @throws ApiError
     */
    public static delete5(
        spaceKey: string,
    ): CancelablePromise<LongTaskSubmission> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/space/{spaceKey}',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                404: `Returned if there is no space with the given key, or if the calling user does not have permission to delete it.`,
            },
        });
    }
    /**
     * Restore space
     * Restore the given Space identified by spaceKey. This method is idempotent i.e., if the Space is already restored then no action will be taken.
     * @param spaceKey the key of the space to update.
     * @returns void
     * @throws ApiError
     */
    public static restore(
        spaceKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/restore',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the Space.`,
                404: ` Returned if there is no space with the given key, or if the calling user does not have permission to view it.`,
            },
        });
    }
}


