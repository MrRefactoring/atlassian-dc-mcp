/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteAndReplaceVersionBean } from '../models/DeleteAndReplaceVersionBean.js';
import type { RemoteEntityLinkJsonBean } from '../models/RemoteEntityLinkJsonBean.js';
import type { RemoteEntityLinksJsonBean } from '../models/RemoteEntityLinksJsonBean.js';
import type { VersionBean } from '../models/VersionBean.js';
import type { VersionIssueCountsBean } from '../models/VersionIssueCountsBean.js';
import type { VersionMoveBean } from '../models/VersionMoveBean.js';
import type { VersionUnresolvedIssueCountsBean } from '../models/VersionUnresolvedIssueCountsBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class VersionService {
    /**
     * Get paginated versions
     * Retrieve paginated collection of versions matching given query optionally filtered by given project IDs.
     * @param maxResults
     * @param query
     * @param projectIds
     * @param startAt
     * @returns VersionBean Returned if the versions are successfully retrieved.
     * @throws ApiError
     */
    public static getPaginatedVersions(
        maxResults: number = 100,
        query: string = '',
        projectIds?: Array<number>,
        startAt?: number,
    ): CancelablePromise<VersionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/version',
            query: {
                'maxResults': maxResults,
                'query': query,
                'projectIds': projectIds,
                'startAt': startAt,
            },
            errors: {
                403: `Returned if the currently authenticated user does not have permission to view the versions.`,
            },
        });
    }
    /**
     * Create new version
     * Creates a version.
     * @param requestBody JSON containing parameters to create the version with
     * @returns VersionBean Returned if the version is successfully created.
     * @throws ApiError
     */
    public static createVersion(
        requestBody: VersionBean,
    ): CancelablePromise<VersionBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/version',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the version could not be created.`,
                403: `Returned if the currently authenticated user does not have permission to edit the version.`,
            },
        });
    }
    /**
     * Get remote version links by global ID
     * Returns the remote version links for a given global ID.
     * @param globalId
     * @returns RemoteEntityLinksJsonBean Returned if the remote version links are successfully retrieved.
     * @throws ApiError
     */
    public static getRemoteVersionLinks(
        globalId?: string,
    ): CancelablePromise<RemoteEntityLinksJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/version/remotelink',
            query: {
                'globalId': globalId,
            },
            errors: {
                404: `Returned if the remote version links could not be retrieved.`,
            },
        });
    }
    /**
     * Get version details
     * Returns a version.
     * @param id
     * @param expand
     * @returns VersionBean Returned if the version was found.
     * @throws ApiError
     */
    public static getVersion(
        id: string,
        expand?: string,
    ): CancelablePromise<VersionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/version/{id}',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `Returned if the version does not exist.`,
            },
        });
    }
    /**
     * Update version details
     * Updates a version.
     * @param id
     * @param requestBody JSON containing parameters to update the version with
     * @returns any Returned if the version is successfully updated.
     * @throws ApiError
     */
    public static updateVersion(
        id: string,
        requestBody: VersionBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/version/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Returned if the currently authenticated user does not have permission to edit the version.`,
                404: `Returned if the version does not exist.`,
            },
        });
    }
    /**
     * Merge versions
     * Merge versions
     * @param moveIssuesTo
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static merge(
        moveIssuesTo: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/version/{id}/mergeto/{moveIssuesTo}',
            path: {
                'moveIssuesTo': moveIssuesTo,
                'id': id,
            },
            errors: {
                403: `Returned if the currently authenticated user does not have permission to delete the version.`,
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Modify version's sequence
     * Modify a version's sequence within a project.
     * The move version bean has 2 alternative field value pairs:
     * - position: An absolute position, which may have a value of 'First', 'Last', 'Earlier' or 'Later'
     * - after: A version to place this version after.  The value should be the self link of another version
     * @param id
     * @param requestBody JSON containing parameters to move the version with
     * @returns VersionBean Returned if the version is successfully moved.
     * @throws ApiError
     */
    public static moveVersion(
        id: string,
        requestBody: VersionMoveBean,
    ): CancelablePromise<VersionBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/version/{id}/move',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Returned if the currently authenticated user does not have permission to move the version.`,
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get version related issues count
     * Returns a bean containing the number of fixed in and affected issues for the given version.
     * @param id
     * @returns VersionIssueCountsBean Returned if the version exists and the currently authenticated user has permission to view it.
     * @throws ApiError
     */
    public static getVersionRelatedIssues(
        id: string,
    ): CancelablePromise<VersionIssueCountsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/version/{id}/relatedIssueCounts',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Delete version and replace values
     * Delete a project version, removed values will be replaced with ones specified by the parameters.
     * @param id
     * @param requestBody JSON containing parameters to replace the deleted version with
     * @returns void
     * @throws ApiError
     */
    public static delete1(
        id: string,
        requestBody: DeleteAndReplaceVersionBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/version/{id}/removeAndSwap',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the replacement didn't succeed`,
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get version unresolved issues count
     * Returns the number of unresolved issues for the given version
     * @param id
     * @returns VersionUnresolvedIssueCountsBean Returned if the version exists and the currently authenticated user has permission to view it.
     * @throws ApiError
     */
    public static getVersionUnresolvedIssues(
        id: string,
    ): CancelablePromise<VersionUnresolvedIssueCountsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/version/{id}/unresolvedIssueCount',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get remote version links by version ID
     * Returns the remote version links associated with the given version ID.
     * @param versionId
     * @returns RemoteEntityLinksJsonBean Returned if the version exists and the currently authenticated user has permission to view it.
     * @throws ApiError
     */
    public static getRemoteVersionLinksByVersionId(
        versionId: string,
    ): CancelablePromise<RemoteEntityLinksJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/version/{versionId}/remotelink',
            path: {
                'versionId': versionId,
            },
            errors: {
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Create or update remote version link without global ID
     * Create a remote version link via POST. The link's global ID will be taken from the JSON payload if provided; otherwise, it will be generated.
     * @param versionId
     * @param requestBody JSON containing parameters to create the remote version link with
     * @returns any Returned if the remote version link is created or updated successfully.
     * @throws ApiError
     */
    public static createOrUpdateRemoteVersionLink(
        versionId: string,
        requestBody: RemoteEntityLinkJsonBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/version/{versionId}/remotelink',
            path: {
                'versionId': versionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the JSON payload is empty or malformed`,
                403: `Returned if the currently authenticated user does not have permission to edit the version.`,
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Delete all remote version links for version
     * Delete all remote version links for a given version ID.
     * @param versionId
     * @returns void
     * @throws ApiError
     */
    public static deleteRemoteVersionLinksByVersionId(
        versionId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/version/{versionId}/remotelink',
            path: {
                'versionId': versionId,
            },
            errors: {
                403: `Returned if the currently authenticated user does not have permission to delete the remote version links.`,
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get specific remote version link
     * Returns the remote version link associated with the given version ID and global ID.
     * @param versionId
     * @param globalId
     * @returns RemoteEntityLinkJsonBean Returned if the version exists and the currently authenticated user has permission to view it.
     * @throws ApiError
     */
    public static getRemoteVersionLink(
        versionId: string,
        globalId: string,
    ): CancelablePromise<RemoteEntityLinkJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/version/{versionId}/remotelink/{globalId}',
            path: {
                'versionId': versionId,
                'globalId': globalId,
            },
            errors: {
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Create or update remote version link with global ID
     * Create a remote version link via POST using the provided global ID.
     * @param versionId
     * @param globalId
     * @param requestBody JSON containing parameters to create the remote version link with
     * @returns any Returned if the remote version link is created or updated successfully.
     * @throws ApiError
     */
    public static createOrUpdateRemoteVersionLink1(
        versionId: string,
        globalId: string,
        requestBody: RemoteEntityLinkJsonBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/version/{versionId}/remotelink/{globalId}',
            path: {
                'versionId': versionId,
                'globalId': globalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the JSON payload is empty or malformed`,
                403: `Returned if the currently authenticated user does not have permission to edit the version.`,
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Delete specific remote version link
     * Delete a specific remote version link with the given version ID and global ID.
     * @param versionId
     * @param globalId
     * @returns void
     * @throws ApiError
     */
    public static deleteRemoteVersionLink(
        versionId: string,
        globalId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/version/{versionId}/remotelink/{globalId}',
            path: {
                'versionId': versionId,
                'globalId': globalId,
            },
            errors: {
                403: `Returned if the currently authenticated user does not have permission to delete the remote version link.`,
                404: `Returned if the version does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
}
