/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichedRepository } from '../models/enrichedRepository.js';
import type { RestAnalyticsSettings } from '../models/restAnalyticsSettings.js';
import type { RestApplicationUserWithPermissions } from '../models/restApplicationUserWithPermissions.js';
import type { RestAuthenticationRequest } from '../models/restAuthenticationRequest.js';
import type { RestMirroredRepositoryDescriptor } from '../models/restMirroredRepositoryDescriptor.js';
import type { RestMirroringRequest } from '../models/restMirroringRequest.js';
import type { RestMirrorServer } from '../models/restMirrorServer.js';
import type { RestMirrorUpgradeRequest } from '../models/restMirrorUpgradeRequest.js';
import type { RestProject } from '../models/restProject.js';
import type { RestRepositoryMirrorEvent } from '../models/restRepositoryMirrorEvent.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class MirroringUpstreamService {
    /**
     * Remove preferred mirror
     * Removes the current user's preferred mirror
     * @returns void
     * @throws ApiError
     */
    public static deletePreferredMirrorId(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/mirroring/latest/account/settings/preferred-mirror',
        });
    }
    /**
     * Get preferred mirror
     * Retrieves the current user's preferred mirror server
     * @returns RestMirrorServer the preferred mirror server
     * @throws ApiError
     */
    public static getPreferredMirrorId(): CancelablePromise<RestMirrorServer> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/account/settings/preferred-mirror',
            errors: {
                404: `The user's preferred mirror server could not be found.`,
            },
        });
    }
    /**
     * Set preferred mirror
     * Sets the mirror specified by a mirror ID as the current user's preferred mirror
     * @param requestBody the mirror ID
     * @returns void
     * @throws ApiError
     */
    public static setPreferredMirrorId(
        requestBody?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/account/settings/preferred-mirror',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `The mirror could not be found.`,
            },
        });
    }
    /**
     * Get analytics settings from upstream
     * Gets the analytics settings from the mirroring upstream
     * @returns RestAnalyticsSettings The analytics settings from upstream
     * @throws ApiError
     */
    public static analyticsSettings(): CancelablePromise<RestAnalyticsSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/analyticsSettings',
        });
    }
    /**
     * Authenticate on behalf of a user
     * Authenticates on behalf of a user. Used by mirrors to check the credentials supplied to them by users. If successful a user and their effective permissions are returned as follows -
     *
     * * For SSH credentials - all the effective user permissions are returned.
     * * For all other credentials - the highest global permission is returned along with highest repository permission if repository ID is also provided in the request.
     *
     * Currently only username/password, bearer token and SSH credentials are supported.
     * @param requestBody
     * @returns RestApplicationUserWithPermissions The user for the supplied credentials and their effective permissions}.
     * @throws ApiError
     */
    public static authenticate(
        requestBody?: RestAuthenticationRequest,
    ): CancelablePromise<RestApplicationUserWithPermissions> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/authenticate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `If the supplied credentials are incomplete or not understood.`,
                401: ` The currently authenticated user is not permitted to authenticate on behalf of users or authentication with the supplied user credentials failed for some reason`,
            },
        });
    }
    /**
     * Get all mirrors
     * Returns a list of mirrors
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any a page of mirrors
     * @throws ApiError
     */
    public static listMirrors(
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestMirrorServer>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/mirrorServers',
            query: {
                'start': start,
                'limit': limit,
            },
        });
    }
    /**
     * Delete mirror by ID
     * Removes a mirror, disabling all access and notifications for the mirror server in question
     * @param mirrorId the ID of the mirror to remove
     * @returns void
     * @throws ApiError
     */
    public static remove(
        mirrorId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/mirroring/latest/mirrorServers/{mirrorId}',
            path: {
                'mirrorId': mirrorId,
            },
        });
    }
    /**
     * Get mirror by ID
     * Returns the mirror specified by a mirror ID
     * @param mirrorId the mirror ID
     * @returns RestMirrorServer the mirror
     * @throws ApiError
     */
    public static getMirror(
        mirrorId: string,
    ): CancelablePromise<RestMirrorServer> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/mirrorServers/{mirrorId}',
            path: {
                'mirrorId': mirrorId,
            },
            errors: {
                404: `The mirror could not be found.`,
            },
        });
    }
    /**
     * Upgrade mirror server
     * Upgrades the mirror server in question with the provided details.This endpoint can only be called by the mirror instance or system administrators<br>Since 5.8
     * @param mirrorId the ID of the mirror to upgrade
     * @param requestBody
     * @returns RestMirrorServer the mirror
     * @throws ApiError
     */
    public static upgrade(
        mirrorId: string,
        requestBody?: RestMirrorUpgradeRequest,
    ): CancelablePromise<RestMirrorServer> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/mirroring/latest/mirrorServers/{mirrorId}',
            path: {
                'mirrorId': mirrorId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Publish RepositoryMirrorEvent
     * Publishes a RepositoryMirrorEvent on the event queue.
     * @param mirrorId the server id of the mirror that raised this event
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static publishEvent(
        mirrorId: string,
        requestBody?: RestRepositoryMirrorEvent,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/mirrorServers/{mirrorId}/events',
            path: {
                'mirrorId': mirrorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Get project
     * Returns the requested project using its primary key ID.<br> Since 6.7
     * @param projectId the ID of the requested project
     * @returns RestProject The project with the specified ID
     * @throws ApiError
     */
    public static getProjectById(
        projectId: string,
    ): CancelablePromise<RestProject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/projects/{projectId}',
            path: {
                'projectId': projectId,
            },
            errors: {
                404: `Project not found`,
            },
        });
    }
    /**
     * Get hashes for repositories in project
     * Returns a page of repositories for a given project, enriched with a content hash
     * @param projectId the id of the requested project
     * @param includeDefaultBranch includes defaultBranchId in the response, if <code>true</code>. Default value is <code>false</code>
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of repositories with content hashes
     * @throws ApiError
     */
    public static getAllReposForProject(
        projectId: string,
        includeDefaultBranch: 'true' | 'false' = 'false',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<EnrichedRepository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/projects/{projectId}/repos',
            path: {
                'projectId': projectId,
            },
            query: {
                'includeDefaultBranch': includeDefaultBranch,
                'start': start,
                'limit': limit,
            },
            errors: {
                409: `Mirroring is not available`,
            },
        });
    }
    /**
     * Get content hashes for repositories
     * Returns a page of repositories enriched with a content hash and default branch
     * @param includeDefaultBranch includes defaultBranchId for each repository in the response, if <code>true</code>. Default value is <code>false</code>.
     * @returns EnrichedRepository A page of repositories with content hashes and default branch
     * @throws ApiError
     */
    public static getAllContentHashes(
        includeDefaultBranch: 'true' | 'false' = 'false',
    ): CancelablePromise<EnrichedRepository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/repos',
            query: {
                'includeDefaultBranch': includeDefaultBranch,
            },
            errors: {
                409: `Mirroring is not available`,
            },
        });
    }
    /**
     * Get content hash for a repository
     * Returns a repository enriched with a content hash and default branch
     * @param repoId the ID of the requested repository
     * @param includeDefaultBranch
     * @returns EnrichedRepository The repository with the specified repoId
     * @throws ApiError
     */
    public static getContentHashById(
        repoId: string,
        includeDefaultBranch: boolean = false,
    ): CancelablePromise<EnrichedRepository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/repos/{repoId}',
            path: {
                'repoId': repoId,
            },
            query: {
                'includeDefaultBranch': includeDefaultBranch,
            },
            errors: {
                404: `Repository not found`,
            },
        });
    }
    /**
     * Get mirrors for repository
     * Returns a page of mirrors for a repository. This resource will return <strong>all mirrors</strong> along with authorized links to the mirror's repository REST resource. To determine if a repository is available on the mirror, the returned URL needs to be called.
     * @param repoId the ID of the requested repository
     * @param preAuthorized
     * @returns RestMirroredRepositoryDescriptor The mirrored repository descriptor
     * @throws ApiError
     */
    public static getRepositoryMirrors(
        repoId: string,
        preAuthorized?: boolean,
    ): CancelablePromise<RestMirroredRepositoryDescriptor> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/repos/{repoId}/mirrors',
            path: {
                'repoId': repoId,
            },
            query: {
                'preAuthorized': preAuthorized,
            },
            errors: {
                409: `Mirroring is not available`,
            },
        });
    }
    /**
     * Get mirroring requests
     * Retrieves a mirroring request
     * @param state (optional) the request state to filter on
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of mirroring requests
     * @throws ApiError
     */
    public static listRequests(
        state?: 'PENDING' | 'ACCEPTED' | 'REJECTED',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestMirroringRequest>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/requests',
            query: {
                'state': state,
                'start': start,
                'limit': limit,
            },
        });
    }
    /**
     * Create a mirroring request
     * Creates a new mirroring request
     * @param requestBody
     * @returns RestMirroringRequest The created mirroring request
     * @throws ApiError
     */
    public static register(
        requestBody?: RestMirroringRequest,
    ): CancelablePromise<RestMirroringRequest> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/requests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `The request was invalid or missing`,
            },
        });
    }
    /**
     * Delete a mirroring request
     * Deletes a mirroring request
     * @param mirroringRequestId the ID of the mirroring request to delete
     * @returns void
     * @throws ApiError
     */
    public static deleteMirroringRequest(
        mirroringRequestId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/mirroring/latest/requests/{mirroringRequestId}',
            path: {
                'mirroringRequestId': mirroringRequestId,
            },
            errors: {
                409: `The request could not be found`,
            },
        });
    }
    /**
     * Get a mirroring request
     * Retrieves a mirroring request
     * @param mirroringRequestId the ID of the mirroring request to retrieve
     * @returns RestMirroringRequest The mirroring request
     * @throws ApiError
     */
    public static getMirroringRequest(
        mirroringRequestId: string,
    ): CancelablePromise<RestMirroringRequest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/requests/{mirroringRequestId}',
            path: {
                'mirroringRequestId': mirroringRequestId,
            },
            errors: {
                409: `The request could not be found`,
            },
        });
    }
    /**
     * Accept a mirroring request
     * Accepts a mirroring request
     * @param mirroringRequestId the ID of the request to accept
     * @returns RestMirrorServer The accepted mirror server
     * @throws ApiError
     */
    public static accept(
        mirroringRequestId: string,
    ): CancelablePromise<RestMirrorServer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/requests/{mirroringRequestId}/accept',
            path: {
                'mirroringRequestId': mirroringRequestId,
            },
            errors: {
                409: `The request could not be found`,
            },
        });
    }
    /**
     * Reject a mirroring request
     * Rejects a mirroring request
     * @param mirroringRequestId the ID of the request to reject
     * @returns RestMirrorServer The rejected mirror server
     * @throws ApiError
     */
    public static reject(
        mirroringRequestId: string,
    ): CancelablePromise<RestMirrorServer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/requests/{mirroringRequestId}/reject',
            path: {
                'mirroringRequestId': mirroringRequestId,
            },
            errors: {
                409: `The request could not be found`,
            },
        });
    }
}

