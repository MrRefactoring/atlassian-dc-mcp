/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestClusterNode } from '../models/restClusterNode.js';
import type { RestDelayedSyncRepository } from '../models/restDelayedSyncRepository.js';
import type { RestMirroredRepository } from '../models/restMirroredRepository.js';
import type { RestMirrorRepositorySynchronizationStatus } from '../models/restMirrorRepositorySynchronizationStatus.js';
import type { RestRefSyncQueue } from '../models/restRefSyncQueue.js';
import type { RestRepositoryLockOwner } from '../models/restRepositoryLockOwner.js';
import type { RestRollingUpgradeState } from '../models/restRollingUpgradeState.js';
import type { RestSyncProgress } from '../models/restSyncProgress.js';
import type { RestUpstreamServer } from '../models/restUpstreamServer.js';
import type { RestUpstreamSettings } from '../models/restUpstreamSettings.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class MirroringMirrorService {
    /**
     * Get farm nodes
     * Retrieves the list of farm nodes in this cluster
     * @returns RestClusterNode The list of farm nodes
     * @throws ApiError
     */
    public static getFarmNodes(): CancelablePromise<Array<RestClusterNode>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/farmNodes',
            errors: {
                404: `The upstream server could not be found`,
            },
        });
    }
    /**
     * Get delayed sync repositories
     * Retrieves a list of repositories which have not synced on one or more mirror nodes for at least the threshold time limit after the content was changed in the corresponding upstream repositories. The threshold time limit is defined by a configuration property <code>plugin.mirroring.repository.diagnostics.sync.tolerance</code>. The detection of out of sync repositories is dependent on the timing of a scheduled job which is controlled by a configuration property <code>plugin.mirroring.synchronization.interval</code> which means in worst case it can take upto <code>plugin.mirroring.repository.diagnostics.sync.tolerance</code> + <code>plugin.mirroring.synchronization.interval</code> time to detect an out-of-sync repository.<p>Note: If <code>plugin.mirroring.repository.diagnostics.sync.enabled=false</code> is set on any of the mirror farm nodes, results will not be reported from that node.
     * @param delayThreshold Returns only those repositories that are delayed for the given duration. The minimum allowed value is the configured value for the property <code>plugin.mirroring.synchronization.interval</code>
     * @param limit Limit the number of delayed sync repositories returned, the maximum allowed value is 100
     * @returns RestDelayedSyncRepository The upstream ID, project key and repository slug of the delayed sync repositories
     * @throws ApiError
     */
    public static getDelayedSyncRepositories(
        delayThreshold?: string,
        limit?: string,
    ): CancelablePromise<Array<RestDelayedSyncRepository>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/mirrorRepos/delayed-sync',
            query: {
                'delayThreshold': delayThreshold,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Get clone URLs
     * Retrieves all available clone urls for the specified repository.
     * @param externalRepositoryId the repository ID
     * @returns RestMirroredRepository The mirrored repository's information.
     * @throws ApiError
     */
    public static getMirroredRepository(
        externalRepositoryId: string,
    ): CancelablePromise<RestMirroredRepository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/mirrorRepos/{externalRepositoryId}',
            path: {
                'externalRepositoryId': externalRepositoryId,
            },
            errors: {
                404: `The upstream server or the repository could not be found.`,
            },
        });
    }
    /**
     * Get synchronization progress state
     *  Retrieves synchronization progress state.If there's no progress to report, this resource will return <pre><code> {"discovering":false,"syncedRepos":0,"totalRepos":0}</code></pre> If there are repositories in the process of synchronizing, but the precise number hasn't been discovered yet, this resource will return: <pre><code> {"discovering":true,"syncedRepos":3,"totalRepos":100}</code></pre> If there is progress to report and the total number of repositories is known, this resource will return: <pre> <code> {"discovering":false,"syncedRepos":242,"totalRepos":1071}</code> </pre>
     * @returns RestSyncProgress the synchronization progress state
     * @throws ApiError
     */
    public static getSynchronizationProgress(): CancelablePromise<RestSyncProgress> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/progress',
            errors: {
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Get the repository lock owner for the syncing process
     * Retrieves the information about the process owning the sync lock for this repository. The process owning the lock could be running on any of the nodes in the mirror farm
     * @param projectKey The project key
     * @param repositorySlug The repository slug
     * @returns RestRepositoryLockOwner The information about the repository lock owner for the syncing process, if the lock is currently being held, otherwise an empty response
     * @throws ApiError
     */
    public static getRepositoryLockOwner(
        projectKey: string,
        repositorySlug: string,
    ): CancelablePromise<RestRepositoryLockOwner> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/supportInfo/projects/{projectKey}/repos/{repositorySlug}/repo-lock-owner',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `When the user doesn't have ADMIN permission`,
                404: `The specified repository does not exist`,
            },
        });
    }
    /**
     * Gets information about the mirrored repository
     * Retrieves information about an external repository mirrored by the mirror server. Particularly the local ID & external ID of the repository
     * @param projectKey The project key
     * @param repositorySlug The repository slug
     * @returns RestMirrorRepositorySynchronizationStatus The sync status of the repository on this node
     * @throws ApiError
     */
    public static getRepoSyncStatus1(
        projectKey: string,
        repositorySlug: string,
    ): CancelablePromise<RestMirrorRepositorySynchronizationStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/supportInfo/projects/{projectKey}/repos/{repositorySlug}/repoSyncStatus',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `When the user doesn't have ADMIN permission`,
                404: `The specified repository does not exist`,
            },
        });
    }
    /**
     * Get items in ref changes queue
     * Retrieves a list of up to <code>plugin.mirroring.farm.max.ref.change.queue.dump.size</code> items currently in the ref changes queue. The ref changes queue is an internal component of every mirror farm, and is shared between all nodes. When the contents of an upstream repository changes, an item is added to this queue so that the mirror farm nodes know to synchronize. The mirror farm constantly polls and removes items from this queue for processing, so it is empty most of the time.
     * @returns RestRefSyncQueue The contents of the ref changes queue
     * @throws ApiError
     */
    public static getRefChangesQueue(): CancelablePromise<RestRefSyncQueue> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/supportInfo/refChangesQueue',
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Get total number of items in ref changes queue
     * Retrieves the total number of items currently in the ref changes queue
     * @returns any The total number of items currently in the ref changes queue
     * @throws ApiError
     */
    public static getRefChangesQueueCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/supportInfo/refChangesQueue/count',
            errors: {
                401: `When the user doesn't have ADMIN permission`,
            },
        });
    }
    /**
     * Get all the repository lock owners for the syncing process
     * Retrieves the information about all the processes from the all the nodes in the mirror farm owning sync lock for any repository
     * @returns RestRepositoryLockOwner A list of all the repository lock owners for the syncing process
     * @throws ApiError
     */
    public static getRepositoryLockOwners(): CancelablePromise<Array<RestRepositoryLockOwner>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/supportInfo/repo-lock-owners',
            errors: {
                401: `When the user doesn't have ADMIN permission`,
            },
        });
    }
    /**
     * Get sync status of repositories
     * Retrieves a page of sync statuses of the repositories on this mirror node
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any The sync status of the repositories on this node
     * @throws ApiError
     */
    public static getRepoSyncStatus(
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestMirrorRepositorySynchronizationStatus>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/supportInfo/repoSyncStatus',
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `When the user doesn't have ADMIN permission`,
            },
        });
    }
    /**
     * Get upstream settings
     * Retrieves upstream settings
     * @returns RestUpstreamSettings the mirror settings
     * @throws ApiError
     */
    public static getMirrorSettings(): CancelablePromise<RestUpstreamSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/syncSettings',
            errors: {
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Update upstream settings
     * Sets the settings for the specified upstream
     * @param requestBody the mirror settings to update to
     * @returns RestUpstreamSettings the updated mirror settings
     * @throws ApiError
     */
    public static setMirrorSettings(
        requestBody?: RestUpstreamSettings,
    ): CancelablePromise<RestUpstreamSettings> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/mirroring/latest/syncSettings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Get mirror mode
     * Gets the current mirror mode
     * @returns any the current mirror mode
     * @throws ApiError
     */
    public static getMirrorMode(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/syncSettings/mode',
            errors: {
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Update mirror mode
     * Sets the mirror mode for the specified upstream
     * @param requestBody
     * @returns any the mode to set
     * @throws ApiError
     */
    public static setMirrorMode(
        requestBody?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/mirroring/latest/syncSettings/mode',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The provided mode is invalid`,
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
            },
        });
    }
    /**
     * Get mirrored project IDs
     * Returns the IDs of the projects that the mirror is configured to mirror
     * @returns any the currently mirrored project IDs
     * @throws ApiError
     */
    public static getMirroredProjects(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/syncSettings/projects',
            errors: {
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Add multiple projects to be mirrored
     * Configures the mirror to mirror the provided projects
     * @param requestBody
     * @returns any the currently mirrored project IDs
     * @throws ApiError
     */
    public static startMirroringProjects(
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/syncSettings/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Stop mirroring project
     * Configures the mirror to no longer mirror the provided project
     * @param projectId the project ID to stop mirroring
     * @returns void
     * @throws ApiError
     */
    public static stopMirroringProject(
        projectId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/mirroring/latest/syncSettings/projects/{projectId}',
            path: {
                'projectId': projectId,
            },
            errors: {
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Add project to be mirrored
     * Configures the mirror to mirror the provided project
     * @param projectId
     * @returns any the currently mirrored project IDs
     * @throws ApiError
     */
    public static startMirroringProject(
        projectId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/syncSettings/projects/{projectId}',
            path: {
                'projectId': projectId,
            },
            errors: {
                401: `When the user is not a service user for the currently registered upstream or doesn't have ADMIN permission`,
                404: `The upstream server could not be found.`,
            },
        });
    }
    /**
     * Get upstream server
     * Retrieves upstream server details.
     * @returns RestUpstreamServer The upstream server.
     * @throws ApiError
     */
    public static getUpstreamServer(): CancelablePromise<RestUpstreamServer> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mirroring/latest/upstreamServer',
            errors: {
                404: `The upstream server could not be found`,
            },
        });
    }
    /**
     * End ZDU upgrade on mirror farm
     * Finalizes the ZDU upgrade on the mirror farm denying heterogeneous cluster formation
     * @returns RestRollingUpgradeState The state of the rolling upgrade which includes the current version on all the nodes in the farm.
     * @throws ApiError
     */
    public static endRollingUpgrade(): CancelablePromise<RestRollingUpgradeState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/zdu/end',
            errors: {
                401: `When the user doesn't have SYS_ADMIN permission`,
            },
        });
    }
    /**
     * Start ZDU upgrade on mirror farm
     * Enables upgrading of individual nodes within the cluster, allowing a heterogeneous cluster formation
     * @returns RestRollingUpgradeState The state of the rolling upgrade which includes the minimum version of all the nodes in the farm.
     * @throws ApiError
     */
    public static startRollingUpgrade(): CancelablePromise<RestRollingUpgradeState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mirroring/latest/zdu/start',
            errors: {
                401: `When the user doesn't have SYS_ADMIN permission`,
            },
        });
    }
}

